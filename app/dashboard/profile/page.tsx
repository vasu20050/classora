'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { User } from '@/types';
import { User as UserIcon, Mail, Shield, Calendar, Save } from 'lucide-react';
import { toast } from 'sonner';
import { getInitials, formatDate } from '@/lib/utils';

export default function ProfilePage() {
  const { user, token } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [bio, setBio] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setBio((user as User & { bio?: string }).bio || '');
    }
  }, [user]);

  const handleSave = async () => {
    setSaving(true);
    // Placeholder — connect to /api/profile PATCH endpoint
    await new Promise((r) => setTimeout(r, 800));
    toast.success('Profile updated!');
    setSaving(false);
  };

  if (!user) return null;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Profile</h1>
        <p className="text-white/50 text-sm mt-1">Manage your account information</p>
      </div>

      {/* Avatar card */}
      <div className="p-6 rounded-2xl bg-white/4 border border-white/6 flex items-center gap-5">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center text-2xl font-bold flex-shrink-0">
          {getInitials(user.name)}
        </div>
        <div>
          <p className="text-lg font-bold">{user.name}</p>
          <p className="text-sm text-white/50">{user.email}</p>
          <span className={`inline-block mt-1.5 text-xs font-semibold px-2.5 py-0.5 rounded-full capitalize ${user.role === 'teacher' ? 'bg-violet-500/20 text-violet-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
            {user.role}
          </span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { icon: Calendar, label: 'Member since', value: formatDate(user.createdAt) },
          { icon: Shield, label: 'Account type', value: user.role.charAt(0).toUpperCase() + user.role.slice(1) },
          { icon: Mail, label: 'Email status', value: 'Verified' },
        ].map((s) => (
          <div key={s.label} className="p-4 rounded-xl bg-white/4 border border-white/6 text-center">
            <s.icon className="w-4 h-4 text-white/40 mx-auto mb-1.5" />
            <div className="text-sm font-medium">{s.value}</div>
            <div className="text-xs text-white/30 mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Edit form */}
      <div className="p-6 rounded-2xl bg-white/4 border border-white/6 space-y-5">
        <h2 className="font-semibold">Edit Profile</h2>

        <div>
          <label htmlFor="profile-name" className="block text-sm font-medium text-white/70 mb-2">Full Name</label>
          <div className="relative">
            <UserIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
            <input
              id="profile-name"
              type="text"
              title="Full Name"
              placeholder="Enter your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-white focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all"
            />
          </div>
        </div>

        <div>
          <label htmlFor="profile-email" className="block text-sm font-medium text-white/70 mb-2">Email</label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
            <input
              id="profile-email"
              type="email"
              title="Email Address"
              placeholder="Email Address"
              value={user.email}
              disabled
              className="w-full bg-white/3 border border-white/6 rounded-xl pl-10 pr-4 py-3 text-sm text-white/40 cursor-not-allowed"
            />
          </div>
          <p className="text-xs text-white/30 mt-1">Email cannot be changed</p>
        </div>

        <div>
          <label htmlFor="profile-bio" className="block text-sm font-medium text-white/70 mb-2">Bio</label>
          <textarea
            id="profile-bio"
            title="Bio"
            rows={3}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Tell your students or classmates a bit about yourself..."
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/25 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all resize-none"
          />
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          id="save-profile-btn"
          className="flex items-center gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 disabled:opacity-60 text-white font-semibold px-5 py-2.5 rounded-xl transition-all"
        >
          {saving ? (
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              <Save className="w-4 h-4" /> Save Changes
            </>
          )}
        </button>
      </div>

      {/* AI Assistant Placeholder */}
      <div className="p-6 rounded-2xl border border-violet-500/20 bg-violet-500/5">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center">
            <span className="text-xs">✨</span>
          </div>
          <h3 className="font-semibold text-violet-300">AI Study Assistant</h3>
          <span className="text-xs bg-violet-500/20 text-violet-400 px-2 py-0.5 rounded-full">Coming Soon</span>
        </div>
        <p className="text-sm text-white/50">
          Get personalized study recommendations, auto-generated summaries of lectures, and AI-powered feedback on your assignments.
        </p>
      </div>
    </div>
  );
}
