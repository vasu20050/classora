'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { Assignment, Submission } from '@/types';
import {
  ArrowLeft, Clock, CheckCircle, Upload, AlertCircle,
  Award, MessageSquare, Users, FileText,
} from 'lucide-react';
import { toast } from 'sonner';
import { formatDate, formatDeadline, isPastDue, getInitials, timeAgo } from '@/lib/utils';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { gradeSchema, GradeInput } from '@/lib/validations';

export default function AssignmentDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { user, token } = useAuth();

  const [assignment, setAssignment] = useState<Assignment | null>(null);
  const [mySubmission, setMySubmission] = useState<Submission | null>(null);
  const [allSubmissions, setAllSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [gradingId, setGradingId] = useState<string | null>(null);

  const isTeacher = user?.role === 'teacher';

  const { register, handleSubmit, formState: { errors } } = useForm<GradeInput>({
    resolver: zodResolver(gradeSchema),
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const headers = { Authorization: `Bearer ${token}` };
        const assignRes = await fetch(`/api/assignments/${id}`, { headers });
        if (!assignRes.ok) return;
        const assignData = await assignRes.json();
        setAssignment(assignData.data);

        const subRes = await fetch(`/api/submissions/${id}`, { headers });
        if (subRes.ok) {
          const subData = await subRes.json();
          if (isTeacher) setAllSubmissions(subData.data || []);
          else setMySubmission(subData.data);
        }
      } finally {
        setLoading(false);
      }
    };
    if (token) fetchData();
  }, [id, token, isTeacher]);

  const handleSubmitWork = async () => {
    setSubmitting(true);
    const res = await fetch(`/api/submissions/${id}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ attachments: [] }),
    });
    const data = await res.json();
    if (res.ok) {
      setMySubmission(data.data);
      toast.success('Work submitted successfully!');
    } else {
      toast.error(data.error || 'Failed to submit');
    }
    setSubmitting(false);
  };

  const handleGrade = async (submissionId: string, data: GradeInput) => {
    const res = await fetch(`/api/submissions/${submissionId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (res.ok) {
      setAllSubmissions((prev) => prev.map((s) => (s._id === submissionId ? json.data : s)));
      toast.success('Grade saved!');
      setGradingId(null);
    } else {
      toast.error(json.error || 'Failed to grade');
    }
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto space-y-4">
        <div className="h-8 w-32 bg-white/4 rounded-xl animate-pulse" />
        <div className="h-48 bg-white/4 rounded-2xl animate-pulse" />
      </div>
    );
  }

  if (!assignment) return <div className="text-white/50 text-center py-20">Assignment not found</div>;

  const deadline = formatDeadline(assignment.dueDate);
  const pastDue = isPastDue(assignment.dueDate);
  const classroom = typeof assignment.classroom === 'object' ? assignment.classroom : null;

  const statusBadge = (status: string) => {
    const map: Record<string, { cls: string; label: string }> = {
      submitted: { cls: 'bg-blue-500/15 text-blue-400', label: 'Submitted' },
      graded: { cls: 'bg-emerald-500/15 text-emerald-400', label: 'Graded' },
      late: { cls: 'bg-amber-500/15 text-amber-400', label: 'Late' },
      missing: { cls: 'bg-rose-500/15 text-rose-400', label: 'Missing' },
    };
    const s = map[status] || map.missing;
    return <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${s.cls}`}>{s.label}</span>;
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Link
        href="/dashboard/assignments"
        className="inline-flex items-center gap-1.5 text-sm text-white/50 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> All Assignments
      </Link>

      {/* Assignment card */}
      <div className="p-6 rounded-2xl bg-white/4 border border-white/6">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-5">
          <div>
            <h1 className="text-xl font-bold">{assignment.title}</h1>
            {classroom && (
              <p className="text-sm text-white/50 mt-1">{classroom.name} · {classroom.subject}</p>
            )}
          </div>
          <div className={`flex items-center gap-1.5 text-sm font-medium flex-shrink-0 ${deadline.urgent ? 'text-rose-400' : 'text-white/60'}`}>
            {deadline.urgent ? <AlertCircle className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
            {deadline.text}
          </div>
        </div>

        <p className="text-sm text-white/70 leading-relaxed whitespace-pre-wrap mb-5">
          {assignment.description}
        </p>

        <div className="flex items-center gap-4 pt-4 border-t border-white/6 text-sm text-white/50">
          <div className="flex items-center gap-1.5">
            <Award className="w-4 h-4 text-amber-400" />
            {assignment.totalMarks} marks
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="w-4 h-4" />
            Due {formatDate(assignment.dueDate)}
          </div>
        </div>
      </div>

      {/* Student: submission area */}
      {!isTeacher && (
        <div className="p-6 rounded-2xl bg-white/4 border border-white/6">
          <h2 className="font-semibold mb-4 flex items-center gap-2">
            <FileText className="w-4 h-4 text-violet-400" /> Your Work
          </h2>

          {mySubmission ? (
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                {statusBadge(mySubmission.status)}
                <span className="text-xs text-white/40">{timeAgo(mySubmission.submittedAt)}</span>
              </div>
              {mySubmission.marks !== undefined && (
                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                  <div className="flex items-center gap-2 text-emerald-400 font-semibold mb-1">
                    <Award className="w-4 h-4" />
                    Grade: {mySubmission.marks} / {assignment.totalMarks}
                  </div>
                  {mySubmission.feedback && (
                    <p className="text-sm text-white/70 mt-2">
                      <span className="text-white/40">Feedback: </span>{mySubmission.feedback}
                    </p>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-6">
              {pastDue ? (
                <div className="text-rose-400 text-sm">⏰ This assignment is past due</div>
              ) : (
                <>
                  <Upload className="w-8 h-8 text-white/20 mx-auto mb-3" />
                  <p className="text-sm text-white/50 mb-4">
                    No submission yet. Submit before {formatDate(assignment.dueDate)}
                  </p>
                  <button
                    onClick={handleSubmitWork}
                    disabled={submitting}
                    id="submit-work-btn"
                    className="inline-flex items-center gap-2 bg-violet-600 hover:bg-violet-500 disabled:opacity-60 text-white font-semibold px-5 py-2.5 rounded-xl transition-all"
                  >
                    {submitting ? (
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <Upload className="w-4 h-4" /> Submit Work
                      </>
                    )}
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      )}

      {/* Teacher: submissions list */}
      {isTeacher && (
        <div className="p-6 rounded-2xl bg-white/4 border border-white/6">
          <h2 className="font-semibold mb-5 flex items-center gap-2">
            <Users className="w-4 h-4 text-violet-400" />
            Submissions ({allSubmissions.length})
          </h2>

          {allSubmissions.length === 0 ? (
            <p className="text-sm text-white/40 text-center py-8">No submissions yet</p>
          ) : (
            <div className="space-y-3">
              {allSubmissions.map((sub) => {
                const student = typeof sub.student === 'object' ? sub.student : null;
                return (
                  <div key={sub._id} className="p-4 rounded-xl border border-white/6 bg-white/2">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-xs font-bold">
                        {student ? getInitials(student.name) : '?'}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{student?.name || 'Unknown'}</p>
                        <p className="text-xs text-white/40">{timeAgo(sub.submittedAt)}</p>
                      </div>
                      {statusBadge(sub.status)}
                    </div>

                    {sub.status === 'graded' ? (
                      <div className="text-sm text-emerald-400 font-medium">
                        {sub.marks} / {assignment.totalMarks} marks
                        {sub.feedback && <span className="text-white/40 font-normal ml-2">· {sub.feedback}</span>}
                      </div>
                    ) : gradingId === sub._id ? (
                      <form
                        onSubmit={handleSubmit((data) => handleGrade(sub._id, data))}
                        className="flex gap-2 mt-2"
                      >
                        <input
                          type="number"
                          min="0"
                          max={assignment.totalMarks}
                          placeholder="Marks"
                          {...register('marks', { valueAsNumber: true })}
                          className="w-24 bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-violet-500 transition-all"
                        />
                        <input
                          type="text"
                          placeholder="Feedback (optional)"
                          {...register('feedback')}
                          className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white placeholder:text-white/25 focus:outline-none focus:border-violet-500 transition-all"
                        />
                        <button
                          type="submit"
                          className="bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium px-3 py-1.5 rounded-lg transition-all"
                        >
                          Save
                        </button>
                        <button
                          type="button"
                          onClick={() => setGradingId(null)}
                          className="text-white/40 text-sm px-2"
                        >
                          Cancel
                        </button>
                      </form>
                    ) : (
                      <button
                        onClick={() => setGradingId(sub._id)}
                        className="text-xs text-violet-400 hover:text-violet-300 flex items-center gap-1 mt-1 transition-colors"
                      >
                        <Award className="w-3.5 h-3.5" /> Grade this submission
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
