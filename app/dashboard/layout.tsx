'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import {
  GraduationCap,
  LayoutDashboard,
  BookOpen,
  ClipboardList,
  Users,
  Settings,
  LogOut,
  Menu,
  X,
  Bell,
  Search,
  ChevronRight,
  Calendar,
} from 'lucide-react';
import { getInitials } from '@/lib/utils';

const TEACHER_NAV = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/dashboard/calendar', label: 'Calendar', icon: Calendar },
  { href: '/dashboard/classrooms', label: 'Classrooms', icon: BookOpen },
  { href: '/dashboard/assignments', label: 'Assignments', icon: ClipboardList },
  { href: '/dashboard/students', label: 'Students', icon: Users },
  { href: '/dashboard/profile', label: 'Profile', icon: Settings },
];

const STUDENT_NAV = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/dashboard/calendar', label: 'Calendar', icon: Calendar },
  { href: '/dashboard/classrooms', label: 'My Classes', icon: BookOpen },
  { href: '/dashboard/assignments', label: 'Assignments', icon: ClipboardList },
  { href: '/dashboard/profile', label: 'Profile', icon: Settings },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, logout, isLoading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isLoading && !user) router.push('/login');
  }, [user, isLoading, router]);

  if (isLoading || !user) {
    return (
      <div className="min-h-screen bg-[#04040f] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-violet-500/30 border-t-violet-500 rounded-full animate-spin" />
      </div>
    );
  }

  const navItems = user.role === 'teacher' ? TEACHER_NAV : STUDENT_NAV;

  return (
    <div className="min-h-screen bg-[#060614] text-white flex">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-64 bg-[#08081a] border-r border-white/5 flex flex-col transition-transform duration-300 lg:translate-x-0 lg:static lg:z-auto ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Logo */}
        <div className="flex items-center gap-2.5 px-5 h-16 border-b border-white/5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center flex-shrink-0">
            <GraduationCap className="w-4 h-4 text-white" />
          </div>
          <span className="text-lg font-bold tracking-tight">Classora</span>
          <button
            onClick={() => setSidebarOpen(false)}
            title="Close sidebar"
            className="ml-auto lg:hidden text-white/40 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User info pill */}
        <div className="mx-3 mt-4 p-3 rounded-xl bg-white/4 border border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center text-xs font-bold flex-shrink-0">
              {getInitials(user.name)}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium truncate">{user.name}</p>
              <p className="text-xs text-white/40 capitalize">{user.role}</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-0.5">
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group ${
                  active
                    ? 'bg-violet-600/20 text-violet-300 border border-violet-500/20'
                    : 'text-white/50 hover:text-white hover:bg-white/5'
                }`}
              >
                <item.icon className={`w-4 h-4 flex-shrink-0 ${active ? 'text-violet-400' : ''}`} />
                {item.label}
                {active && <ChevronRight className="w-3 h-3 ml-auto text-violet-400" />}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="px-3 pb-4">
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-white/40 hover:text-rose-400 hover:bg-rose-500/10 transition-all duration-150"
          >
            <LogOut className="w-4 h-4" />
            Sign out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="sticky top-0 z-30 h-16 border-b border-white/5 bg-[#060614]/90 backdrop-blur-xl flex items-center gap-3 px-4 sm:px-6">
          {/* Mobile menu button */}
          <button
            onClick={() => setSidebarOpen(true)}
            title="Open sidebar"
            className="lg:hidden w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/5 text-white/60"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Search */}
          <button
            onClick={() => setSearchOpen(!searchOpen)}
            className="flex items-center gap-2 flex-1 max-w-xs bg-white/4 hover:bg-white/6 border border-white/8 rounded-xl px-3 py-2 text-sm text-white/40 transition-all"
          >
            <Search className="w-4 h-4" />
            <span>Search classes, assignments...</span>
          </button>

          <div className="ml-auto flex items-center gap-2">
            {/* Notifications */}
            <button title="Notifications" className="relative w-9 h-9 flex items-center justify-center rounded-xl hover:bg-white/5 text-white/50 hover:text-white transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-violet-500 rounded-full" />
            </button>

            {/* Avatar */}
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center text-sm font-bold">
              {getInitials(user.name)}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 fade-in">
          {children}
        </main>
      </div>
    </div>
  );
}
