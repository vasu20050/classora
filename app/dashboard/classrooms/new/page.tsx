'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { classroomSchema, ClassroomInput } from '@/lib/validations';
import { useAuth } from '@/contexts/AuthContext';
import { BookOpen, ArrowLeft, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import { CLASS_COLORS } from '@/lib/utils';

export default function NewClassroomPage() {
  const { token } = useAuth();
  const router = useRouter();
  const [selectedColor, setSelectedColor] = useState<string>(CLASS_COLORS[0]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ClassroomInput>({ resolver: zodResolver(classroomSchema) });

  const onSubmit = async (data: ClassroomInput) => {
    const res = await fetch('/api/classrooms', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ ...data, coverColor: selectedColor }),
    });
    const json = await res.json();
    if (res.ok) {
      toast.success('Classroom created!');
      router.push(`/dashboard/classrooms/${json.data._id}`);
    } else {
      toast.error(json.error || 'Failed to create classroom');
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <Link
          href="/dashboard/classrooms"
          className="inline-flex items-center gap-1.5 text-sm text-white/50 hover:text-white transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Classrooms
        </Link>
        <h1 className="text-2xl font-bold">Create a Classroom</h1>
        <p className="text-white/50 text-sm mt-1">Set up a new class for your students</p>
      </div>

      {/* Preview card */}
      <div className={`h-32 rounded-2xl bg-gradient-to-br ${selectedColor} mb-6 flex items-end p-5 relative overflow-hidden`}>
        <div className="absolute inset-0 bg-black/10" />
        <div className="relative">
          <div className="text-white font-bold text-xl">New Classroom</div>
          <div className="text-white/70 text-sm">Subject</div>
        </div>
      </div>

      {/* Color picker */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-white/70 mb-3">Card Color</label>
        <div className="flex gap-2 flex-wrap">
          {CLASS_COLORS.map((color) => (
            <button
              key={color}
              type="button"
              title={`Select color ${color}`}
              onClick={() => setSelectedColor(color)}
              className={`w-8 h-8 rounded-lg bg-gradient-to-br ${color} transition-all ${
                selectedColor === color ? 'ring-2 ring-white ring-offset-2 ring-offset-[#060614] scale-110' : 'hover:scale-105'
              }`}
            />
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Name */}
        <div>
          <label htmlFor="class-name" className="block text-sm font-medium text-white/70 mb-2">
            Classroom Name <span className="text-rose-400">*</span>
          </label>
          <input
            id="class-name"
            type="text"
            placeholder="e.g. Advanced Web Development"
            {...register('name')}
            className="w-full bg-white/4 border border-white/8 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/25 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all"
          />
          {errors.name && <p className="mt-1.5 text-xs text-rose-400">{errors.name.message}</p>}
        </div>

        {/* Subject */}
        <div>
          <label htmlFor="class-subject" className="block text-sm font-medium text-white/70 mb-2">
            Subject <span className="text-rose-400">*</span>
          </label>
          <input
            id="class-subject"
            type="text"
            placeholder="e.g. Computer Science"
            {...register('subject')}
            className="w-full bg-white/4 border border-white/8 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/25 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all"
          />
          {errors.subject && <p className="mt-1.5 text-xs text-rose-400">{errors.subject.message}</p>}
        </div>

        {/* Section */}
        <div>
          <label htmlFor="class-section" className="block text-sm font-medium text-white/70 mb-2">
            Section <span className="text-white/30 text-xs">(optional)</span>
          </label>
          <input
            id="class-section"
            type="text"
            placeholder="e.g. A or Morning Batch"
            {...register('section')}
            className="w-full bg-white/4 border border-white/8 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/25 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all"
          />
        </div>

        {/* Description */}
        <div>
          <label htmlFor="class-desc" className="block text-sm font-medium text-white/70 mb-2">
            Description <span className="text-white/30 text-xs">(optional)</span>
          </label>
          <textarea
            id="class-desc"
            rows={3}
            placeholder="Brief description of what students will learn..."
            {...register('description')}
            className="w-full bg-white/4 border border-white/8 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/25 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all resize-none"
          />
        </div>

        <div className="flex gap-3 pt-2">
          <Link
            href="/dashboard/classrooms"
            className="flex-1 text-center py-3 text-sm font-medium text-white/50 border border-white/8 rounded-xl hover:border-white/15 hover:text-white transition-all"
          >
            Cancel
          </Link>
          <button
            id="create-classroom-submit"
            type="submit"
            disabled={isSubmitting}
            className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 disabled:opacity-60 text-white font-semibold py-3 rounded-xl transition-all hover:shadow-lg hover:shadow-violet-500/20"
          >
            {isSubmitting ? (
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <Sparkles className="w-4 h-4" /> Create Classroom
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
