'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { assignmentSchema, AssignmentInput } from '@/lib/validations';
import { useAuth } from '@/contexts/AuthContext';
import { ArrowLeft, ClipboardList } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import { Classroom } from '@/types';

function NewAssignmentForm() {
  const { token } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedClassroom = searchParams.get('classroomId');

  const [classrooms, setClassrooms] = useState<Classroom[]>([]);

  useEffect(() => {
    fetch('/api/classrooms', { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json())
      .then((d) => setClassrooms(d.data || []));
  }, [token]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AssignmentInput>({
    resolver: zodResolver(assignmentSchema),
    defaultValues: { classroomId: preselectedClassroom || '', totalMarks: 100 },
  });

  const onSubmit = async (data: AssignmentInput) => {
    const res = await fetch('/api/assignments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (res.ok) {
      toast.success('Assignment created!');
      router.push(`/dashboard/assignments/${json.data._id}`);
    } else {
      toast.error(json.error || 'Failed to create assignment');
    }
  };

  // Min date = tomorrow
  const minDate = new Date();
  minDate.setDate(minDate.getDate() + 1);
  const minDateStr = minDate.toISOString().slice(0, 16);

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <Link
          href="/dashboard/assignments"
          className="inline-flex items-center gap-1.5 text-sm text-white/50 hover:text-white transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Assignments
        </Link>
        <h1 className="text-2xl font-bold">Create Assignment</h1>
        <p className="text-white/50 text-sm mt-1">Post a new assignment for your students</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 bg-white/4 border border-white/6 rounded-2xl p-6">
        {/* Classroom */}
        <div>
          <label htmlFor="assign-classroom" className="block text-sm font-medium text-white/70 mb-2">
            Classroom <span className="text-rose-400">*</span>
          </label>
          <select
            id="assign-classroom"
            {...register('classroomId')}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all appearance-none"
          >
            <option value="" className="bg-[#08081a]">Select a classroom...</option>
            {classrooms.map((c) => (
              <option key={c._id} value={c._id} className="bg-[#08081a]">
                {c.name} — {c.subject}
              </option>
            ))}
          </select>
          {errors.classroomId && <p className="mt-1.5 text-xs text-rose-400">{errors.classroomId.message}</p>}
        </div>

        {/* Title */}
        <div>
          <label htmlFor="assign-title" className="block text-sm font-medium text-white/70 mb-2">
            Title <span className="text-rose-400">*</span>
          </label>
          <input
            id="assign-title"
            type="text"
            placeholder="e.g. Chapter 5 — Binary Trees"
            {...register('title')}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/25 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all"
          />
          {errors.title && <p className="mt-1.5 text-xs text-rose-400">{errors.title.message}</p>}
        </div>

        {/* Description */}
        <div>
          <label htmlFor="assign-desc" className="block text-sm font-medium text-white/70 mb-2">
            Description <span className="text-rose-400">*</span>
          </label>
          <textarea
            id="assign-desc"
            rows={5}
            placeholder="Describe the assignment, requirements, and submission format..."
            {...register('description')}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/25 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all resize-none"
          />
          {errors.description && <p className="mt-1.5 text-xs text-rose-400">{errors.description.message}</p>}
        </div>

        {/* Due date + Marks */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="assign-due" className="block text-sm font-medium text-white/70 mb-2">
              Due Date <span className="text-rose-400">*</span>
            </label>
            <input
              id="assign-due"
              type="datetime-local"
              min={minDateStr}
              {...register('dueDate')}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all [color-scheme:dark]"
            />
            {errors.dueDate && <p className="mt-1.5 text-xs text-rose-400">{errors.dueDate.message}</p>}
          </div>
          <div>
            <label htmlFor="assign-marks" className="block text-sm font-medium text-white/70 mb-2">
              Total Marks <span className="text-rose-400">*</span>
            </label>
            <input
              id="assign-marks"
              type="number"
              min="1"
              max="1000"
              {...register('totalMarks', { valueAsNumber: true })}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all"
            />
            {errors.totalMarks && <p className="mt-1.5 text-xs text-rose-400">{errors.totalMarks.message}</p>}
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <Link
            href="/dashboard/assignments"
            className="flex-1 text-center py-3 text-sm font-medium text-white/50 border border-white/8 rounded-xl hover:border-white/15 hover:text-white transition-all"
          >
            Cancel
          </Link>
          <button
            id="create-assignment-submit"
            type="submit"
            disabled={isSubmitting}
            className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 disabled:opacity-60 text-white font-semibold py-3 rounded-xl transition-all hover:shadow-lg hover:shadow-violet-500/20"
          >
            {isSubmitting ? (
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <ClipboardList className="w-4 h-4" /> Create Assignment
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

export default function NewAssignmentPage() {
  return <Suspense><NewAssignmentForm /></Suspense>;
}
