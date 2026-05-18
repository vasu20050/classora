'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Assignment } from '@/types';
import {
  ClipboardList, Plus, Filter, Clock, CheckCircle,
  AlertCircle, BookOpen, ArrowRight,
} from 'lucide-react';
import { formatDeadline, formatDate, getColorFromString } from '@/lib/utils';
import { Suspense } from 'react';

type Filter = 'all' | 'upcoming' | 'past';

function AssignmentsContent() {
  const { user, token } = useAuth();
  const searchParams = useSearchParams();
  const classroomId = searchParams.get('classroomId');

  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<Filter>('all');

  const isTeacher = user?.role === 'teacher';

  useEffect(() => {
    const url = classroomId ? `/api/assignments?classroomId=${classroomId}` : '/api/assignments';
    fetch(url, { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json())
      .then((d) => setAssignments(d.data || []))
      .finally(() => setLoading(false));
  }, [token, classroomId]);

  const filtered = assignments.filter((a) => {
    if (filter === 'upcoming') return new Date(a.dueDate) > new Date();
    if (filter === 'past') return new Date(a.dueDate) <= new Date();
    return true;
  });

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Assignments</h1>
          <p className="text-white/50 text-sm mt-1">{assignments.length} total assignment{assignments.length !== 1 ? 's' : ''}</p>
        </div>
        {isTeacher && (
          <Link
            href="/dashboard/assignments/new"
            className="flex items-center gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-all hover:shadow-lg hover:shadow-violet-500/20"
          >
            <Plus className="w-4 h-4" /> New Assignment
          </Link>
        )}
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1 p-1 bg-white/4 rounded-xl w-fit">
        {(['all', 'upcoming', 'past'] as Filter[]).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all ${
              filter === f ? 'bg-violet-600 text-white' : 'text-white/50 hover:text-white'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {loading && (
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-20 bg-white/4 rounded-2xl animate-pulse" />
          ))}
        </div>
      )}

      {!loading && filtered.length === 0 && (
        <div className="text-center py-16">
          <div className="w-14 h-14 rounded-2xl bg-white/4 flex items-center justify-center mx-auto mb-4">
            <ClipboardList className="w-6 h-6 text-white/20" />
          </div>
          <p className="text-white/40 text-sm">No assignments found</p>
        </div>
      )}

      {!loading && filtered.length > 0 && (
        <div className="space-y-3 stagger">
          {filtered.map((assignment) => {
            const deadline = formatDeadline(assignment.dueDate);
            const classroom = typeof assignment.classroom === 'object' ? assignment.classroom : null;
            const color = classroom ? getColorFromString(classroom.name) : 'from-violet-600 to-indigo-600';

            return (
              <Link
                key={assignment._id}
                href={`/dashboard/assignments/${assignment._id}`}
                className="flex items-center gap-4 p-4 rounded-2xl bg-white/4 border border-white/6 hover:border-white/12 hover:bg-white/6 transition-all duration-200 group"
              >
                {/* Left accent */}
                <div className={`w-1 h-12 rounded-full bg-gradient-to-b ${color} flex-shrink-0`} />

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-medium text-sm">{assignment.title}</p>
                      {classroom && (
                        <p className="text-xs text-white/40 mt-0.5 flex items-center gap-1">
                          <BookOpen className="w-3 h-3" /> {classroom.name}
                        </p>
                      )}
                    </div>
                    <div className={`flex items-center gap-1 text-xs font-medium flex-shrink-0 ${deadline.urgent ? 'text-rose-400' : 'text-white/50'}`}>
                      {deadline.urgent ? <AlertCircle className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
                      {deadline.text}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 flex-shrink-0">
                  <div className="text-center hidden sm:block">
                    <div className="text-sm font-semibold">{assignment.totalMarks}</div>
                    <div className="text-xs text-white/30">marks</div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-white/20 group-hover:text-violet-400 group-hover:translate-x-0.5 transition-all" />
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function AssignmentsPage() {
  return <Suspense><AssignmentsContent /></Suspense>;
}
