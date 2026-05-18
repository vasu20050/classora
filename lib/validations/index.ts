import { z } from 'zod';

export const signupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(50),
  email: z.string().email('Invalid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Must contain an uppercase letter')
    .regex(/[0-9]/, 'Must contain a number'),
  role: z.enum(['student', 'teacher'], { message: 'Select a role' }),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const classroomSchema = z.object({
  name: z.string().min(3, 'Classroom name must be at least 3 characters').max(60),
  subject: z.string().min(2, 'Subject is required').max(40),
  section: z.string().max(20).optional(),
  description: z.string().max(500).optional(),
});

export const assignmentSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(100),
  description: z.string().min(10, 'Description must be at least 10 characters').max(2000),
  dueDate: z.string().refine((date) => new Date(date) > new Date(), {
    message: 'Due date must be in the future',
  }),
  totalMarks: z.number().min(1).max(1000),
  classroomId: z.string().min(1, 'Classroom is required'),
});

export const announcementSchema = z.object({
  content: z.string().min(1, 'Announcement cannot be empty').max(2000),
});

export const gradeSchema = z.object({
  marks: z.number().min(0),
  feedback: z.string().max(1000).optional(),
});

export const joinClassSchema = z.object({
  code: z.string().length(6, 'Class code must be exactly 6 characters').toUpperCase(),
});

export type SignupInput = z.infer<typeof signupSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type ClassroomInput = z.infer<typeof classroomSchema>;
export type AssignmentInput = z.infer<typeof assignmentSchema>;
export type AnnouncementInput = z.infer<typeof announcementSchema>;
export type GradeInput = z.infer<typeof gradeSchema>;
export type JoinClassInput = z.infer<typeof joinClassSchema>;
