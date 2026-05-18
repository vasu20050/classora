'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { Classroom, Assignment } from '@/types';
import {
  BookOpen,
  ClipboardList,
  TrendingUp,
  Clock,
  Plus,
  ArrowRight,
  Users,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';
import { formatDeadline, getColorFromString, timeAgo } from '@/lib/utils';

export default function DashboardPage() {
  const { user, token } = useAuth();
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const headers = { Authorization: `Bearer ${token}` };
        const [classRes, assignRes] = await Promise.all([
          fetch('/api/classrooms', { headers }),
          fetch('/api/assignments', { headers }),
        ]);
        if (classRes.ok) setClassrooms(await classRes.json().then((d) => d.data));
        if (assignRes.ok) setAssignments(await assignRes.json().then((d) => d.data));
      } finally {
        setLoading(false);
      }
    };
    if (token) fetchData();
  }, [token]);

  const upcomingAssignments = assignments
    .filter((a) => new Date(a.dueDate) > new Date())
    .slice(0, 5);

  const isTeacher = user?.role === 'teacher';

  const stats = isTeacher
    ? [
        { label: 'Total Classes', value: classrooms.length, icon: BookOpen, color: 'text-violet-400', bg: 'bg-violet-500/10' },
        { label: 'Assignments', value: assignments.length, icon: ClipboardList, color: 'text-indigo-400', bg: 'bg-indigo-500/10' },
        { label: 'Total Students', value: classrooms.reduce((acc, c) => acc + (c.students?.length || 0), 0), icon: Users, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
        { label: 'Active', value: classrooms.filter(c => new Date(c.createdAt) > new Date(Date.now() - 30*24*60*60*1000)).length, icon: TrendingUp, color: 'text-amber-400', bg: 'bg-amber-500/10' },
      ]
    : [
        { label: 'Joined Classes', value: classrooms.length, icon: BookOpen, color: 'text-violet-400', bg: 'bg-violet-500/10' },
        { label: 'Assignments', value: assignments.length, icon: ClipboardList, color: 'text-indigo-400', bg: 'bg-indigo-500/10' },
        { label: 'Upcoming', value: upcomingAssignments.length, icon: Clock, color: 'text-amber-400', bg: 'bg-amber-500/10' },
        { label: 'Completed', value: assignments.length - upcomingAssignments.length, icon: CheckCircle, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
      ];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 bg-white/5 rounded-xl animate-pulse" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-28 bg-white/5 rounded-2xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">
            Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 18 ? 'afternoon' : 'evening'},{' '}
            <span className="bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
              {user?.name.split(' ')[0]}
            </span>{' '}
            👋
          </h1>
          <p className="text-white/50 text-sm mt-1">
            {isTeacher
              ? `You have ${classrooms.length} active classroom${classrooms.length !== 1 ? 's' : ''}`
              : `You&apos;re enrolled in ${classrooms.length} class${classrooms.length !== 1 ? 'es' : ''}`}
          </p>
        </div>
        <div className="flex gap-2">
          {isTeacher ? (
            <Link
              href="/dashboard/classrooms/new"
              className="flex items-center gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-all hover:shadow-lg hover:shadow-violet-500/20"
            >
              <Plus className="w-4 h-4" /> New Classroom
            </Link>
          ) : (
            <Link
              href="/dashboard/classrooms/join"
              className="flex items-center gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-all hover:shadow-lg hover:shadow-violet-500/20"
            >
              <Plus className="w-4 h-4" /> Join Class
            </Link>
          )}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 stagger">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="p-5 rounded-2xl bg-white/4 border border-white/6 hover:border-white/10 hover:bg-white/6 transition-all duration-200 group"
          >
            <div className={`w-9 h-9 rounded-xl ${stat.bg} flex items-center justify-center mb-3`}>
              <stat.icon className={`w-4.5 h-4.5 ${stat.color}`} />
            </div>
            <div className="text-2xl font-bold tabular-nums">{stat.value}</div>
            <div className="text-sm text-white/50 mt-0.5">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Recent Classrooms */}
        <div className="lg:col-span-3 bg-white/4 border border-white/6 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-semibold">
              {isTeacher ? 'Your Classrooms' : 'Your Classes'}
            </h2>
            <Link
              href="/dashboard/classrooms"
              className="text-xs text-violet-400 hover:text-violet-300 flex items-center gap-1 transition-colors"
            >
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {classrooms.length === 0 ? (
            <div className="text-center py-10">
              <BookOpen className="w-8 h-8 text-white/20 mx-auto mb-2" />
              <p className="text-sm text-white/40">
                {isTeacher ? 'Create your first classroom to get started' : 'Join a class using a class code'}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {classrooms.slice(0, 4).map((classroom) => (
                <Link
                  key={classroom._id}
                  href={`/dashboard/classrooms/${classroom._id}`}
                  className="flex items-center gap-4 p-3.5 rounded-xl hover:bg-white/5 transition-all group"
                >
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${getColorFromString(classroom.name)} flex items-center justify-center text-sm font-bold flex-shrink-0`}>
                    {classroom.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{classroom.name}</p>
                    <p className="text-xs text-white/40">{classroom.subject} {classroom.section && `· ${classroom.section}`}</p>
                  </div>
                  <div className="text-xs text-white/30">
                    {classroom.students?.length || 0} students
                  </div>
                  <ArrowRight className="w-4 h-4 text-white/20 group-hover:text-white/50 group-hover:translate-x-0.5 transition-all" />
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Upcoming Assignments */}
        <div className="lg:col-span-2 bg-white/4 border border-white/6 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-semibold">Upcoming</h2>
            <Link
              href="/dashboard/assignments"
              className="text-xs text-violet-400 hover:text-violet-300 flex items-center gap-1 transition-colors"
            >
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {upcomingAssignments.length === 0 ? (
            <div className="text-center py-10">
              <CheckCircle className="w-8 h-8 text-emerald-500/40 mx-auto mb-2" />
              <p className="text-sm text-white/40">All caught up! 🎉</p>
            </div>
          ) : (
            <div className="space-y-3">
              {upcomingAssignments.map((assignment) => {
                const deadline = formatDeadline(assignment.dueDate);
                return (
                  <div
                    key={assignment._id}
                    className="p-3.5 rounded-xl bg-white/3 border border-white/5 hover:border-white/10 transition-all"
                  >
                    <div className="flex items-start gap-2">
                      <div className={`mt-0.5 flex-shrink-0 ${deadline.urgent ? 'text-rose-400' : 'text-emerald-400'}`}>
                        {deadline.urgent ? (
                          <AlertCircle className="w-4 h-4" />
                        ) : (
                          <Clock className="w-4 h-4" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{assignment.title}</p>
                        <p className="text-xs text-white/40 mt-0.5 truncate">
                          {typeof assignment.classroom === 'object' ? assignment.classroom.name : ''}
                        </p>
                        <p className={`text-xs mt-1 font-medium ${deadline.urgent ? 'text-rose-400' : 'text-white/50'}`}>
                          {deadline.text}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
