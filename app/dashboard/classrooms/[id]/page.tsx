'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { Classroom, Assignment, Announcement } from '@/types';
import {
  ArrowLeft, Code, Users, BookOpen, ClipboardList, MessageSquare,
  Plus, Copy, Trash2, CheckCircle, Clock, AlertCircle,
} from 'lucide-react';
import { toast } from 'sonner';
import { getColorFromString, timeAgo, formatDeadline, getInitials } from '@/lib/utils';

type Tab = 'stream' | 'assignments' | 'people';

export default function ClassroomDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { user, token } = useAuth();
  const router = useRouter();

  const [classroom, setClassroom] = useState<Classroom | null>(null);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [tab, setTab] = useState<Tab>('stream');
  const [loading, setLoading] = useState(true);
  const [newAnnouncement, setNewAnnouncement] = useState('');
  const [posting, setPosting] = useState(false);

  const isTeacher = user?.role === 'teacher';

  useEffect(() => {
    fetch(`/api/classrooms/${id}`, { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json())
      .then((d) => {
        if (d.success) {
          setClassroom(d.data.classroom);
          setAssignments(d.data.assignments);
          setAnnouncements(d.data.announcements);
        } else {
          toast.error(d.error);
          router.push('/dashboard/classrooms');
        }
      })
      .finally(() => setLoading(false));
  }, [id, token, router]);

  const copyCode = () => {
    if (classroom?.code) {
      navigator.clipboard.writeText(classroom.code);
      toast.success('Class code copied!');
    }
  };

  const postAnnouncement = async () => {
    if (!newAnnouncement.trim()) return;
    setPosting(true);
    const res = await fetch(`/api/classrooms/${id}/announcements`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ content: newAnnouncement }),
    });
    const data = await res.json();
    if (res.ok) {
      setAnnouncements([data.data, ...announcements]);
      setNewAnnouncement('');
      toast.success('Announcement posted!');
    } else {
      toast.error(data.error);
    }
    setPosting(false);
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-36 bg-white/4 rounded-2xl animate-pulse" />
        <div className="h-10 bg-white/4 rounded-xl animate-pulse" />
        <div className="h-40 bg-white/4 rounded-2xl animate-pulse" />
      </div>
    );
  }

  if (!classroom) return null;
  const color = getColorFromString(classroom.name);
  const teacher = typeof classroom.teacher === 'object' ? classroom.teacher : null;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Back */}
      <Link
        href="/dashboard/classrooms"
        className="inline-flex items-center gap-1.5 text-sm text-white/50 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> All Classrooms
      </Link>

      {/* Hero cover */}
      <div className={`relative h-40 rounded-2xl bg-gradient-to-br ${color} overflow-hidden`}>
        <div className="absolute inset-0 bg-black/15" />
        <div className="absolute inset-0 p-6 flex flex-col justify-end">
          <h1 className="text-2xl font-bold text-white">{classroom.name}</h1>
          <p className="text-white/70 text-sm mt-0.5">
            {classroom.subject} {classroom.section && `· Section ${classroom.section}`}
          </p>
        </div>
        {isTeacher && (
          <button
            onClick={copyCode}
            className="absolute top-4 right-4 flex items-center gap-1.5 bg-black/25 hover:bg-black/40 text-white px-3 py-1.5 rounded-lg text-xs font-mono transition-all"
          >
            <Code className="w-3.5 h-3.5" />
            {classroom.code}
            <Copy className="w-3 h-3 opacity-60" />
          </button>
        )}
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { icon: Users, label: 'Students', value: classroom.students?.length || 0 },
          { icon: ClipboardList, label: 'Assignments', value: assignments.length },
          { icon: MessageSquare, label: 'Posts', value: announcements.length },
        ].map((s) => (
          <div key={s.label} className="p-4 rounded-xl bg-white/4 border border-white/6 text-center">
            <s.icon className="w-4 h-4 text-white/40 mx-auto mb-1" />
            <div className="text-xl font-bold">{s.value}</div>
            <div className="text-xs text-white/40">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-white/4 rounded-xl w-fit">
        {(['stream', 'assignments', 'people'] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all ${
              tab === t
                ? 'bg-violet-600 text-white shadow-md'
                : 'text-white/50 hover:text-white'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Stream Tab */}
      {tab === 'stream' && (
        <div className="space-y-4">
          {/* Post announcement */}
          <div className="p-4 rounded-2xl bg-white/4 border border-white/6">
            <textarea
              rows={3}
              value={newAnnouncement}
              onChange={(e) => setNewAnnouncement(e.target.value)}
              placeholder={isTeacher ? 'Announce something to your class...' : 'Share something with the class...'}
              className="w-full bg-transparent text-sm text-white placeholder:text-white/30 resize-none focus:outline-none"
            />
            <div className="flex justify-end mt-2">
              <button
                onClick={postAnnouncement}
                disabled={!newAnnouncement.trim() || posting}
                className="text-sm font-semibold bg-violet-600 hover:bg-violet-500 disabled:opacity-40 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg transition-all"
              >
                {posting ? 'Posting...' : 'Post'}
              </button>
            </div>
          </div>

          {/* Announcements */}
          {announcements.length === 0 ? (
            <div className="text-center py-12 text-white/40 text-sm">
              No announcements yet. Be the first to post!
            </div>
          ) : (
            announcements.map((a) => {
              const author = typeof a.author === 'object' ? a.author : null;
              return (
                <div key={a._id} className="p-4 rounded-2xl bg-white/4 border border-white/6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center text-xs font-bold">
                      {author ? getInitials(author.name) : '?'}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{author?.name || 'Unknown'}</p>
                      <p className="text-xs text-white/40">{timeAgo(a.createdAt)}</p>
                    </div>
                  </div>
                  <p className="text-sm text-white/80 whitespace-pre-wrap">{a.content}</p>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Assignments Tab */}
      {tab === 'assignments' && (
        <div className="space-y-4">
          {isTeacher && (
            <Link
              href={`/dashboard/assignments/new?classroomId=${classroom._id}`}
              className="flex items-center gap-2 w-fit bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-all"
            >
              <Plus className="w-4 h-4" /> New Assignment
            </Link>
          )}

          {assignments.length === 0 ? (
            <div className="text-center py-12 text-white/40 text-sm">No assignments yet</div>
          ) : (
            assignments.map((a) => {
              const deadline = formatDeadline(a.dueDate);
              return (
                <Link
                  key={a._id}
                  href={`/dashboard/assignments/${a._id}`}
                  className="flex items-center gap-4 p-4 rounded-2xl bg-white/4 border border-white/6 hover:border-white/12 hover:bg-white/6 transition-all group"
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${deadline.urgent ? 'bg-rose-500/15' : 'bg-violet-500/15'}`}>
                    {deadline.urgent ? (
                      <AlertCircle className="w-5 h-5 text-rose-400" />
                    ) : (
                      <CheckCircle className="w-5 h-5 text-violet-400" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm">{a.title}</p>
                    <p className="text-xs text-white/40 mt-0.5">{a.totalMarks} marks</p>
                  </div>
                  <div className={`text-xs font-medium ${deadline.urgent ? 'text-rose-400' : 'text-white/50'}`}>
                    {deadline.text}
                  </div>
                </Link>
              );
            })
          )}
        </div>
      )}

      {/* People Tab */}
      {tab === 'people' && (
        <div className="space-y-6">
          {/* Teacher */}
          <div>
            <h3 className="text-xs uppercase tracking-widest text-white/30 font-semibold mb-3">Teacher</h3>
            {teacher && (
              <div className="flex items-center gap-3 p-3 rounded-xl bg-white/4">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center text-sm font-bold">
                  {getInitials(teacher.name)}
                </div>
                <div>
                  <p className="text-sm font-medium">{teacher.name}</p>
                  <p className="text-xs text-white/40">{teacher.email}</p>
                </div>
              </div>
            )}
          </div>

          {/* Students */}
          <div>
            <h3 className="text-xs uppercase tracking-widest text-white/30 font-semibold mb-3">
              Students ({classroom.students?.length || 0})
            </h3>
            {classroom.students?.length === 0 ? (
              <p className="text-sm text-white/40">No students have joined yet</p>
            ) : (
              <div className="space-y-2">
                {classroom.students?.map((student) => {
                  const s = typeof student === 'object' ? student : null;
                  if (!s) return null;
                  return (
                    <div key={s._id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/4 transition-all">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-sm font-bold">
                        {getInitials(s.name)}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{s.name}</p>
                        <p className="text-xs text-white/40">{s.email}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
