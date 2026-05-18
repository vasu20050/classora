// Core TypeScript types for Classora

export type UserRole = 'student' | 'teacher';

export interface User {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  bio?: string;
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
}

export interface Classroom {
  _id: string;
  name: string;
  description?: string;
  subject: string;
  section?: string;
  code: string;
  teacher: User;
  students: User[];
  coverColor: string;
  createdAt: string;
}

export interface Assignment {
  _id: string;
  title: string;
  description: string;
  classroom: string | Classroom;
  teacher: string | User;
  dueDate: string;
  totalMarks: number;
  attachments: Attachment[];
  createdAt: string;
}

export interface Submission {
  _id: string;
  assignment: string | Assignment;
  student: string | User;
  attachments: Attachment[];
  status: 'submitted' | 'graded' | 'late' | 'missing';
  marks?: number;
  feedback?: string;
  submittedAt: string;
}

export interface Announcement {
  _id: string;
  content: string;
  classroom: string | Classroom;
  author: string | User;
  attachments?: Attachment[];
  createdAt: string;
}

export interface Attachment {
  url: string;
  publicId?: string;
  name: string;
  type: string;
  size?: number;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  total: number;
  page: number;
  limit: number;
}

export interface DashboardStats {
  classrooms: number;
  assignments: number;
  submissions: number;
  pendingGrading?: number;
  upcomingDeadlines?: Assignment[];
  recentActivity?: Announcement[];
}
