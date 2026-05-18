import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Classroom } from '@/models/Classroom';
import { Assignment } from '@/models/Assignment';
import { Announcement } from '@/models/Announcement';
import { getAuthUser } from '@/lib/auth';

type Params = { params: Promise<{ id: string }> };

// GET /api/classrooms/[id] — get classroom details + stream data
export async function GET(req: NextRequest, { params }: Params) {
  try {
    const user = await getAuthUser(req);
    if (!user) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    await connectDB();
    const { id } = await params;

    const classroom = await Classroom.findById(id)
      .populate('teacher', 'name email avatar')
      .populate('students', 'name email avatar');

    if (!classroom) {
      return NextResponse.json({ success: false, error: 'Classroom not found' }, { status: 404 });
    }

    // Check if user is a member (teacher or student)
    const isTeacher = classroom.teacher._id.toString() === user.userId;
    const isStudent = classroom.students.some((s: { _id: { toString: () => string } }) => s._id.toString() === user.userId);

    if (!isTeacher && !isStudent) {
      return NextResponse.json({ success: false, error: 'Access denied' }, { status: 403 });
    }

    // Fetch recent announcements and assignments for the stream
    const [announcements, assignments] = await Promise.all([
      Announcement.find({ classroom: id })
        .populate('author', 'name email avatar')
        .sort({ createdAt: -1 })
        .limit(20),
      Assignment.find({ classroom: id }).sort({ dueDate: 1 }),
    ]);

    return NextResponse.json({
      success: true,
      data: { classroom, announcements, assignments },
    });
  } catch (error) {
    console.error('[CLASSROOM GET ERROR]', error);
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}

// DELETE /api/classrooms/[id] — teacher-only
export async function DELETE(req: NextRequest, { params }: Params) {
  try {
    const user = await getAuthUser(req);
    if (!user) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    await connectDB();
    const { id } = await params;

    const classroom = await Classroom.findById(id);
    if (!classroom) return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });
    if (classroom.teacher.toString() !== user.userId) {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
    }

    await Classroom.findByIdAndDelete(id);
    return NextResponse.json({ success: true, message: 'Classroom deleted' });
  } catch (error) {
    console.error('[CLASSROOM DELETE ERROR]', error);
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}
