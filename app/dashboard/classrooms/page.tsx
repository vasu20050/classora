'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { Classroom } from '@/types';
import { BookOpen, Plus, Users, Code, ArrowRight, Search } from 'lucide-react';
import { getColorFromString, timeAgo } from '@/lib/utils';

export default function ClassroomsPage() {
  const { user, token } = useAuth();
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const isTeacher = user?.role === 'teacher';

  useEffect(() => {
    fetch('/api/classrooms', { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json())
      .then((d) => setClassrooms(d.data || []))
      .finally(() => setLoading(false));
  }, [token]);

  const filtered = classrooms.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.subject.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">{isTeacher ? 'Classrooms' : 'My Classes'}</h1>
          <p className="text-white/50 text-sm mt-1">
            {isTeacher ? `Managing ${classrooms.length} classroom${classrooms.length !== 1 ? 's' : ''}` : `Enrolled in ${classrooms.length} class${classrooms.length !== 1 ? 'es' : ''}`}
          </p>
        </div>
        <Link
          href={isTeacher ? '/dashboard/classrooms/new' : '/dashboard/classrooms/join'}
          className="flex items-center gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-all hover:shadow-lg hover:shadow-violet-500/20"
        >
          <Plus className="w-4 h-4" />
          {isTeacher ? 'New Classroom' : 'Join a Class'}
        </Link>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
        <input
          type="text"
          placeholder="Search by name or subject..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-sm bg-white/4 border border-white/8 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-violet-500 transition-all"
        />
      </div>

      {/* Loading skeletons */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-52 bg-white/4 rounded-2xl animate-pulse" />
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && filtered.length === 0 && (
        <div className="text-center py-20">
          <div className="w-16 h-16 rounded-2xl bg-white/4 flex items-center justify-center mx-auto mb-4">
            <BookOpen className="w-7 h-7 text-white/20" />
          </div>
          <h3 className="font-semibold text-white/70 mb-1">
            {search ? 'No classrooms match your search' : isTeacher ? 'No classrooms yet' : 'No classes yet'}
          </h3>
          <p className="text-sm text-white/40 mb-5">
            {isTeacher ? 'Create your first classroom to get started' : 'Join a class with a 6-character code from your teacher'}
          </p>
          <Link
            href={isTeacher ? '/dashboard/classrooms/new' : '/dashboard/classrooms/join'}
            className="inline-flex items-center gap-2 bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-all"
          >
            <Plus className="w-4 h-4" />
            {isTeacher ? 'Create Classroom' : 'Join a Class'}
          </Link>
        </div>
      )}

      {/* Classroom cards */}
      {!loading && filtered.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 stagger">
          {filtered.map((classroom) => {
            const color = getColorFromString(classroom.name);
            const teacher = typeof classroom.teacher === 'object' ? classroom.teacher : null;
            return (
              <Link
                key={classroom._id}
                href={`/dashboard/classrooms/${classroom._id}`}
                className="group block rounded-2xl border border-white/6 bg-white/4 hover:border-white/12 hover:bg-white/6 transition-all duration-200 overflow-hidden hover:-translate-y-1"
              >
                {/* Cover gradient */}
                <div className={`h-28 bg-gradient-to-br ${color} relative`}>
                  <div className="absolute inset-0 bg-black/10" />
                  <div className="absolute top-4 left-4">
                    <h3 className="text-white font-bold text-lg leading-tight">{classroom.name}</h3>
                    <p className="text-white/70 text-sm">{classroom.subject}</p>
                  </div>
                  {isTeacher && classroom.code && (
                    <div className="absolute top-3 right-3 flex items-center gap-1 bg-black/20 rounded-lg px-2 py-1">
                      <Code className="w-3 h-3 text-white/70" />
                      <span className="text-xs font-mono text-white/80">{classroom.code}</span>
                    </div>
                  )}
                </div>

                {/* Card body */}
                <div className="p-4">
                  {classroom.section && (
                    <p className="text-xs text-white/40 mb-3">Section {classroom.section}</p>
                  )}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs text-white/50">
                      <Users className="w-3.5 h-3.5" />
                      {classroom.students?.length || 0} students
                    </div>
                    {teacher && (
                      <div className="text-xs text-white/40">
                        {isTeacher ? 'You' : teacher.name}
                      </div>
                    )}
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <p className="text-xs text-white/30">{timeAgo(classroom.createdAt)}</p>
                    <ArrowRight className="w-4 h-4 text-white/30 group-hover:text-violet-400 group-hover:translate-x-0.5 transition-all" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
