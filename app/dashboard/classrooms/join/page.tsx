'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { joinClassSchema, JoinClassInput } from '@/lib/validations';
import { useAuth } from '@/contexts/AuthContext';
import { ArrowLeft, KeyRound, GraduationCap } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

export default function JoinClassPage() {
  const { token } = useAuth();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<JoinClassInput>({ resolver: zodResolver(joinClassSchema) });

  const onSubmit = async (data: JoinClassInput) => {
    const res = await fetch('/api/classrooms/join', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ code: data.code.toUpperCase() }),
    });
    const json = await res.json();
    if (res.ok) {
      toast.success(json.message || 'Joined classroom!');
      router.push(`/dashboard/classrooms/${json.data._id}`);
    } else {
      toast.error(json.error || 'Failed to join classroom');
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="mb-6">
        <Link
          href="/dashboard/classrooms"
          className="inline-flex items-center gap-1.5 text-sm text-white/50 hover:text-white transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Classes
        </Link>
        <h1 className="text-2xl font-bold">Join a Class</h1>
        <p className="text-white/50 text-sm mt-1">Enter the 6-character code from your teacher</p>
      </div>

      {/* Info card */}
      <div className="p-5 rounded-2xl bg-violet-500/8 border border-violet-500/20 mb-8 flex gap-4">
        <GraduationCap className="w-5 h-5 text-violet-400 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-medium text-violet-300 mb-1">How to get a class code</p>
          <p className="text-xs text-white/50 leading-relaxed">
            Ask your teacher to share their 6-character class code (e.g. <span className="font-mono text-white/70">XK9M2P</span>).
            You&apos;ll find it on their classroom card.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <label htmlFor="class-code" className="block text-sm font-medium text-white/70 mb-2">
            Class Code
          </label>
          <div className="relative">
            <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
            <input
              id="class-code"
              type="text"
              placeholder="e.g. XK9M2P"
              maxLength={6}
              {...register('code')}
              className="w-full bg-white/4 border border-white/8 rounded-xl pl-12 pr-4 py-4 text-2xl font-mono text-center tracking-[0.5em] uppercase text-white placeholder:text-white/20 placeholder:tracking-normal placeholder:text-sm placeholder:font-sans focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all"
              onChange={(e) => {
                e.target.value = e.target.value.toUpperCase();
              }}
            />
          </div>
          {errors.code && <p className="mt-1.5 text-xs text-rose-400">{errors.code.message}</p>}
        </div>

        <button
          id="join-class-submit"
          type="submit"
          disabled={isSubmitting}
          className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 disabled:opacity-60 text-white font-semibold py-3 rounded-xl transition-all hover:shadow-lg hover:shadow-violet-500/20"
        >
          {isSubmitting ? (
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            'Join Classroom'
          )}
        </button>
      </form>
    </div>
  );
}
