import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Assignment } from '@/models/Assignment';
import { Classroom } from '@/models/Classroom';
import { getAuthUser } from '@/lib/auth';
import { assignmentSchema } from '@/lib/validations';

export async function GET(req: NextRequest) {
  try {
    const user = await getAuthUser(req);
    if (!user) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    await connectDB();

    const { searchParams } = new URL(req.url);
    const classroomId = searchParams.get('classroomId');

    let query: Record<string, unknown> = {};

    if (classroomId) {
      query.classroom = classroomId;
    } else if (user.role === 'teacher') {
      query.teacher = user.userId;
    } else {
      // Get all classrooms student belongs to
      const classrooms = await Classroom.find({ students: user.userId }).select('_id');
      query.classroom = { $in: classrooms.map((c) => c._id) };
    }

    const assignments = await Assignment.find(query)
      .populate('classroom', 'name subject coverColor')
      .populate('teacher', 'name avatar')
      .sort({ dueDate: 1 });

    return NextResponse.json({ success: true, data: assignments });
  } catch (error) {
    console.error('[ASSIGNMENTS GET ERROR]', error);
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getAuthUser(req);
    if (!user) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    if (user.role !== 'teacher') {
      return NextResponse.json({ success: false, error: 'Only teachers can create assignments' }, { status: 403 });
    }

    await connectDB();

    const body = await req.json();
    const parsed = assignmentSchema.safeParse({ ...body, totalMarks: Number(body.totalMarks) });
    if (!parsed.success) {
      return NextResponse.json({ success: false, error: parsed.error.errors[0].message }, { status: 400 });
    }

    const { title, description, dueDate, totalMarks, classroomId } = parsed.data;

    // Verify teacher owns this classroom
    const classroom = await Classroom.findById(classroomId);
    if (!classroom || classroom.teacher.toString() !== user.userId) {
      return NextResponse.json({ success: false, error: 'Classroom not found or access denied' }, { status: 403 });
    }

    const assignment = await Assignment.create({
      title,
      description,
      dueDate: new Date(dueDate),
      totalMarks,
      classroom: classroomId,
      teacher: user.userId,
      attachments: body.attachments || [],
    });

    await assignment.populate('classroom', 'name subject');

    return NextResponse.json({ success: true, data: assignment }, { status: 201 });
  } catch (error) {
    console.error('[ASSIGNMENT CREATE ERROR]', error);
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}
