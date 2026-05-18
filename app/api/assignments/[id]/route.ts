import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Assignment } from '@/models/Assignment';
import { getAuthUser } from '@/lib/auth';

type Params = { params: Promise<{ id: string }> };

// GET /api/assignments/[id]
export async function GET(req: NextRequest, { params }: Params) {
  try {
    const user = await getAuthUser(req);
    if (!user) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    await connectDB();
    const { id } = await params;

    const assignment = await Assignment.findById(id)
      .populate('classroom', 'name subject coverColor')
      .populate('teacher', 'name email avatar');

    if (!assignment) {
      return NextResponse.json({ success: false, error: 'Assignment not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: assignment });
  } catch (error) {
    console.error('[ASSIGNMENT GET BY ID ERROR]', error);
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}

// DELETE /api/assignments/[id] — teacher only
export async function DELETE(req: NextRequest, { params }: Params) {
  try {
    const user = await getAuthUser(req);
    if (!user) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    if (user.role !== 'teacher') {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
    }

    await connectDB();
    const { id } = await params;

    const assignment = await Assignment.findById(id);
    if (!assignment) return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });
    if (assignment.teacher.toString() !== user.userId) {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
    }

    await Assignment.findByIdAndDelete(id);
    return NextResponse.json({ success: true, message: 'Assignment deleted' });
  } catch (error) {
    console.error('[ASSIGNMENT DELETE ERROR]', error);
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}
