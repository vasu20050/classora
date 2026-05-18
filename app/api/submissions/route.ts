import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Submission } from '@/models/Submission';
import { getAuthUser } from '@/lib/auth';

// GET /api/submissions — get all submissions for the authenticated user
// Teachers get submissions for their assignments; students get their own submissions
export async function GET(req: NextRequest) {
  try {
    const user = await getAuthUser(req);
    if (!user) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    await connectDB();

    const { searchParams } = new URL(req.url);
    const classroomId = searchParams.get('classroomId');
    const assignmentId = searchParams.get('assignmentId');

    let query: Record<string, unknown> = {};

    if (user.role === 'student') {
      query.student = user.userId;
    }

    if (classroomId) query.classroom = classroomId;
    if (assignmentId) query.assignment = assignmentId;

    const submissions = await Submission.find(query)
      .populate('assignment', 'title dueDate totalMarks')
      .populate('student', 'name email avatar')
      .populate('classroom', 'name subject')
      .sort({ submittedAt: -1 });

    return NextResponse.json({ success: true, data: submissions });
  } catch (error) {
    console.error('[SUBMISSIONS LIST ERROR]', error);
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}
