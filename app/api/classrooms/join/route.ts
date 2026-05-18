import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Classroom } from '@/models/Classroom';
import { getAuthUser } from '@/lib/auth';
import { joinClassSchema } from '@/lib/validations';

// POST /api/classrooms/join — student joins by code
export async function POST(req: NextRequest) {
  try {
    const user = await getAuthUser(req);
    if (!user) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    if (user.role !== 'student') {
      return NextResponse.json({ success: false, error: 'Only students can join classrooms' }, { status: 403 });
    }

    await connectDB();

    const body = await req.json();
    const parsed = joinClassSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ success: false, error: parsed.error.errors[0].message }, { status: 400 });
    }

    const { code } = parsed.data;
    const classroom = await Classroom.findOne({ code: code.toUpperCase() });

    if (!classroom) {
      return NextResponse.json({ success: false, error: 'No classroom found with this code' }, { status: 404 });
    }

    // Check if already enrolled
    if (classroom.students.some((s: { toString: () => string }) => s.toString() === user.userId)) {
      return NextResponse.json({ success: false, error: 'You are already enrolled in this classroom' }, { status: 409 });
    }

    // Check if student is the teacher
    if (classroom.teacher.toString() === user.userId) {
      return NextResponse.json({ success: false, error: 'You cannot join your own classroom' }, { status: 400 });
    }

    classroom.students.push(user.userId as unknown as typeof classroom.students[0]);
    await classroom.save();

    await classroom.populate('teacher', 'name email avatar');

    return NextResponse.json({
      success: true,
      data: classroom,
      message: `Joined "${classroom.name}" successfully!`,
    });
  } catch (error) {
    console.error('[JOIN CLASS ERROR]', error);
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}
