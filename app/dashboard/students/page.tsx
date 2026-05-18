'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Classroom, User } from '@/types';
import { Users, Search, Mail, BookOpen } from 'lucide-react';
import { getInitials } from '@/lib/utils';

interface StudentWithClasses extends User {
  classes: string[];
}

export default function StudentsPage() {
  const { token } = useAuth();
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetch('/api/classrooms', { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json())
      .then((d) => setClassrooms(d.data || []))
      .finally(() => setLoading(false));
  }, [token]);

  // Aggregate unique students across all classrooms
  const studentMap = new Map<string, StudentWithClasses>();
  classrooms.forEach((c) => {
    (c.students || []).forEach((s) => {
      if (typeof s !== 'object') return;
      const existing = studentMap.get(s._id);
      if (existing) {
        existing.classes.push(c.name);
      } else {
        studentMap.set(s._id, { ...s, classes: [c.name] });
      }
    });
  });

  const students = Array.from(studentMap.values()).filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Students</h1>
          <p className="text-white/50 text-sm mt-1">
            {studentMap.size} student{studentMap.size !== 1 ? 's' : ''} across {classrooms.length} classroom{classrooms.length !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
        <input
          type="text"
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-sm bg-white/4 border border-white/8 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-violet-500 transition-all"
        />
      </div>

      {/* Loading */}
      {loading && (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 bg-white/4 rounded-2xl animate-pulse" />
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && students.length === 0 && (
        <div className="text-center py-16">
          <div className="w-14 h-14 rounded-2xl bg-white/4 flex items-center justify-center mx-auto mb-4">
            <Users className="w-6 h-6 text-white/20" />
          </div>
          <p className="text-white/40 text-sm">
            {search ? 'No students match your search' : 'No students have joined your classrooms yet'}
          </p>
        </div>
      )}

      {/* Student table */}
      {!loading && students.length > 0 && (
        <div className="rounded-2xl border border-white/6 overflow-hidden">
          {/* Table header */}
          <div className="grid grid-cols-12 px-5 py-3 bg-white/3 border-b border-white/5 text-xs font-semibold uppercase tracking-wider text-white/30">
            <div className="col-span-5">Student</div>
            <div className="col-span-4 hidden sm:block">Email</div>
            <div className="col-span-3">Classes</div>
          </div>

          {/* Rows */}
          <div className="divide-y divide-white/5">
            {students.map((student) => (
              <div
                key={student._id}
                className="grid grid-cols-12 items-center px-5 py-3.5 hover:bg-white/3 transition-all group"
              >
                {/* Name + avatar */}
                <div className="col-span-5 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-xs font-bold flex-shrink-0">
                    {getInitials(student.name)}
                  </div>
                  <span className="text-sm font-medium truncate">{student.name}</span>
                </div>

                {/* Email */}
                <div className="col-span-4 hidden sm:flex items-center gap-1.5 text-sm text-white/40 truncate">
                  <Mail className="w-3.5 h-3.5 flex-shrink-0" />
                  <span className="truncate">{student.email}</span>
                </div>

                {/* Classes */}
                <div className="col-span-3 sm:col-span-3">
                  <div className="flex flex-wrap gap-1">
                    {student.classes.slice(0, 2).map((cls) => (
                      <span
                        key={cls}
                        className="text-xs bg-violet-500/15 text-violet-400 px-2 py-0.5 rounded-full truncate max-w-[80px]"
                        title={cls}
                      >
                        {cls}
                      </span>
                    ))}
                    {student.classes.length > 2 && (
                      <span className="text-xs text-white/30">+{student.classes.length - 2}</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Per-classroom breakdown */}
      {!loading && classrooms.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-white/50 uppercase tracking-wider">By Classroom</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {classrooms.map((c) => (
              <div key={c._id} className="p-4 rounded-xl bg-white/4 border border-white/6 flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-violet-500/15 flex items-center justify-center flex-shrink-0">
                  <BookOpen className="w-4 h-4 text-violet-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{c.name}</p>
                  <p className="text-xs text-white/40">{c.subject}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="text-sm font-semibold">{c.students?.length || 0}</div>
                  <div className="text-xs text-white/30">students</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
