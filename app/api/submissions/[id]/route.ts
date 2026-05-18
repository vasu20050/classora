import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Submission } from '@/models/Submission';
import { Assignment } from '@/models/Assignment';
import { getAuthUser } from '@/lib/auth';
import { gradeSchema } from '@/lib/validations';

type Params = { params: Promise<{ id: string }> };

// GET /api/submissions/[id] — get all submissions for an assignment (teacher) or own submission (student)
export async function GET(req: NextRequest, { params }: Params) {
  try {
    const user = await getAuthUser(req);
    if (!user) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    await connectDB();
    const { id } = await params;

    if (user.role === 'teacher') {
      const submissions = await Submission.find({ assignment: id })
        .populate('student', 'name email avatar')
        .sort({ submittedAt: -1 });
      return NextResponse.json({ success: true, data: submissions });
    } else {
      const submission = await Submission.findOne({ assignment: id, student: user.userId });
      return NextResponse.json({ success: true, data: submission });
    }
  } catch (error) {
    console.error('[SUBMISSION GET ERROR]', error);
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}

// POST /api/submissions/[id] — student submits work for assignment [id]
export async function POST(req: NextRequest, { params }: Params) {
  try {
    const user = await getAuthUser(req);
    if (!user) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    if (user.role !== 'student') {
      return NextResponse.json({ success: false, error: 'Only students can submit' }, { status: 403 });
    }

    await connectDB();
    const { id } = await params; // assignment ID

    const assignment = await Assignment.findById(id);
    if (!assignment) return NextResponse.json({ success: false, error: 'Assignment not found' }, { status: 404 });

    // Check for existing submission
    const existing = await Submission.findOne({ assignment: id, student: user.userId });
    if (existing) {
      return NextResponse.json({ success: false, error: 'You have already submitted this assignment' }, { status: 409 });
    }

    const body = await req.json();
    const isLate = new Date() > assignment.dueDate;

    const submission = await Submission.create({
      assignment: id,
      student: user.userId,
      classroom: assignment.classroom,
      attachments: body.attachments || [],
      status: isLate ? 'late' : 'submitted',
    });

    return NextResponse.json({ success: true, data: submission }, { status: 201 });
  } catch (error) {
    console.error('[SUBMISSION CREATE ERROR]', error);
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}

// PATCH /api/submissions/[id] — teacher grades a submission (id = submissionId here)
export async function PATCH(req: NextRequest, { params }: Params) {
  try {
    const user = await getAuthUser(req);
    if (!user) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    if (user.role !== 'teacher') {
      return NextResponse.json({ success: false, error: 'Only teachers can grade submissions' }, { status: 403 });
    }

    await connectDB();
    const { id } = await params;

    const body = await req.json();
    const parsed = gradeSchema.safeParse({ marks: Number(body.marks), feedback: body.feedback });
    if (!parsed.success) {
      return NextResponse.json({ success: false, error: parsed.error.issues[0].message }, { status: 400 });
    }

    const submission = await Submission.findByIdAndUpdate(
      id,
      { marks: parsed.data.marks, feedback: parsed.data.feedback, status: 'graded' },
      { new: true }
    ).populate('student', 'name email avatar');

    if (!submission) return NextResponse.json({ success: false, error: 'Submission not found' }, { status: 404 });

    return NextResponse.json({ success: true, data: submission });
  } catch (error) {
    console.error('[GRADE ERROR]', error);
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}
