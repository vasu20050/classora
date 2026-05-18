import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Classroom } from '@/models/Classroom';
import { getAuthUser } from '@/lib/auth';
import { classroomSchema } from '@/lib/validations';
import { generateClassCode, getColorFromString } from '@/lib/utils';

// GET /api/classrooms — list classrooms for authenticated user
export async function GET(req: NextRequest) {
  try {
    const user = await getAuthUser(req);
    if (!user) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    await connectDB();

    let classrooms;
    if (user.role === 'teacher') {
      classrooms = await Classroom.find({ teacher: user.userId })
        .populate('teacher', 'name email avatar')
        .populate('students', 'name email avatar')
        .sort({ createdAt: -1 });
    } else {
      classrooms = await Classroom.find({ students: user.userId })
        .populate('teacher', 'name email avatar')
        .populate('students', 'name email avatar')
        .sort({ createdAt: -1 });
    }

    return NextResponse.json({ success: true, data: classrooms });
  } catch (error) {
    console.error('[CLASSROOMS GET ERROR]', error);
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}

// POST /api/classrooms — create a new classroom (teachers only)
export async function POST(req: NextRequest) {
  try {
    const user = await getAuthUser(req);
    if (!user) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    if (user.role !== 'teacher') {
      return NextResponse.json({ success: false, error: 'Only teachers can create classrooms' }, { status: 403 });
    }

    await connectDB();

    const body = await req.json();
    const parsed = classroomSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ success: false, error: parsed.error.errors[0].message }, { status: 400 });
    }

    const { name, subject, section, description } = parsed.data;

    // Generate unique 6-char code
    let code = generateClassCode();
    while (await Classroom.findOne({ code })) {
      code = generateClassCode(); // retry on collision
    }

    const classroom = await Classroom.create({
      name,
      subject,
      section,
      description,
      teacher: user.userId,
      code,
      coverColor: getColorFromString(name),
    });

    await classroom.populate('teacher', 'name email avatar');

    return NextResponse.json({ success: true, data: classroom }, { status: 201 });
  } catch (error) {
    console.error('[CLASSROOM CREATE ERROR]', error);
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}
