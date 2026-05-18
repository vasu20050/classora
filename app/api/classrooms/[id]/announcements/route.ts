import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Announcement } from '@/models/Announcement';
import { Classroom } from '@/models/Classroom';
import { getAuthUser } from '@/lib/auth';
import { announcementSchema } from '@/lib/validations';

type Params = { params: Promise<{ id: string }> };

// POST /api/classrooms/[id]/announcements
export async function POST(req: NextRequest, { params }: Params) {
  try {
    const user = await getAuthUser(req);
    if (!user) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    await connectDB();
    const { id } = await params;

    // Verify membership
    const classroom = await Classroom.findById(id);
    if (!classroom) return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });

    const isMember =
      classroom.teacher.toString() === user.userId ||
      classroom.students.some((s: { toString: () => string }) => s.toString() === user.userId);

    if (!isMember) return NextResponse.json({ success: false, error: 'Access denied' }, { status: 403 });

    const body = await req.json();
    const parsed = announcementSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ success: false, error: parsed.error.issues[0].message }, { status: 400 });
    }

    const announcement = await Announcement.create({
      content: parsed.data.content,
      classroom: id,
      author: user.userId,
    });

    await announcement.populate('author', 'name email avatar');

    return NextResponse.json({ success: true, data: announcement }, { status: 201 });
  } catch (error) {
    console.error('[ANNOUNCEMENT ERROR]', error);
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}
