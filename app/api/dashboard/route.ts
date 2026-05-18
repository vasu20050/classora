import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Classroom } from '@/models/Classroom';
import { Assignment } from '@/models/Assignment';
import { Submission } from '@/models/Submission';
import { getAuthUser } from '@/lib/auth';

// GET /api/dashboard — returns role-aware stats for the dashboard
export async function GET(req: NextRequest) {
  try {
    const user = await getAuthUser(req);
    if (!user) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    await connectDB();

    if (user.role === 'teacher') {
      // Parallel queries for teacher stats
      const [classrooms, assignments, pendingSubmissions] = await Promise.all([
        Classroom.find({ teacher: user.userId }).select('_id name students'),
        Assignment.find({ teacher: user.userId }).select('_id title dueDate').sort({ dueDate: 1 }),
        Submission.countDocuments({
          // Count submissions awaiting grading for teacher's assignments
          status: { $in: ['submitted', 'late'] },
          assignment: {
            $in: (await Assignment.find({ teacher: user.userId }).select('_id')).map((a) => a._id),
          },
        }),
      ]);

      const totalStudents = new Set(
        classrooms.flatMap((c) => c.students.map((s: { toString(): string }) => s.toString()))
      ).size;

      return NextResponse.json({
        success: true,
        data: {
          classrooms: classrooms.length,
          assignments: assignments.length,
          totalStudents,
          pendingGrading: pendingSubmissions,
          upcomingAssignments: assignments
            .filter((a) => a.dueDate > new Date())
            .slice(0, 5),
        },
      });
    } else {
      // Student stats
      const [enrolledClassrooms, submissions] = await Promise.all([
        Classroom.find({ students: user.userId }).select('_id name'),
        Submission.find({ student: user.userId })
          .populate('assignment', 'title dueDate totalMarks')
          .sort({ submittedAt: -1 })
          .limit(10),
      ]);

      const classroomIds = enrolledClassrooms.map((c) => c._id);
      const upcomingAssignments = await Assignment.find({
        classroom: { $in: classroomIds },
        dueDate: { $gt: new Date() },
      })
        .populate('classroom', 'name subject')
        .sort({ dueDate: 1 })
        .limit(5);

      return NextResponse.json({
        success: true,
        data: {
          classrooms: enrolledClassrooms.length,
          submissions: submissions.length,
          graded: submissions.filter((s) => s.status === 'graded').length,
          upcomingAssignments,
          recentSubmissions: submissions,
        },
      });
    }
  } catch (error) {
    console.error('[DASHBOARD ERROR]', error);
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}
