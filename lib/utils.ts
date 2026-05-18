import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format, formatDistanceToNow, isPast } from 'date-fns';

/** Merge Tailwind class names safely */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Format a date string to readable format */
export function formatDate(date: string | Date): string {
  return format(new Date(date), 'MMM d, yyyy');
}

/** Format a date to relative time (e.g. "2 hours ago") */
export function timeAgo(date: string | Date): string {
  return formatDistanceToNow(new Date(date), { addSuffix: true });
}

/** Check if a date is past due */
export function isPastDue(date: string | Date): boolean {
  return isPast(new Date(date));
}

/** Format deadline with color-coded urgency */
export function formatDeadline(date: string | Date): { text: string; urgent: boolean } {
  const d = new Date(date);
  const now = new Date();
  const diffHours = (d.getTime() - now.getTime()) / (1000 * 60 * 60);

  if (isPast(d)) return { text: 'Past due', urgent: true };
  if (diffHours < 24) return { text: `Due in ${Math.ceil(diffHours)}h`, urgent: true };
  if (diffHours < 72) return { text: formatDistanceToNow(d, { addSuffix: true }), urgent: true };
  return { text: format(d, 'MMM d'), urgent: false };
}

/** Generate a random 6-character classroom code */
export function generateClassCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

/** Get initials from a name */
export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

/** Color palette for classroom cards */
export const CLASS_COLORS = [
  'from-violet-600 to-indigo-600',
  'from-emerald-500 to-teal-600',
  'from-rose-500 to-pink-600',
  'from-orange-500 to-amber-600',
  'from-cyan-500 to-blue-600',
  'from-purple-600 to-pink-600',
] as const;

/** Get a consistent color from a string (for classrooms) */
export function getColorFromString(str: string): string {
  const index = str.charCodeAt(0) % CLASS_COLORS.length;
  return CLASS_COLORS[index];
}

/** Format file size to human-readable */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

/** Get file icon class from file type */
export function getFileType(mimeType: string): 'pdf' | 'image' | 'doc' | 'other' {
  if (mimeType.includes('pdf')) return 'pdf';
  if (mimeType.includes('image')) return 'image';
  if (mimeType.includes('word') || mimeType.includes('document')) return 'doc';
  return 'other';
}
