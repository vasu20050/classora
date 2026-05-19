import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { User } from '@/models/User';
import { signToken, setAuthCookie } from '@/lib/auth';
import { signupSchema } from '@/lib/validations';

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const body = await req.json();
    const parsed = signupSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const { name, email, password, role } = parsed.data;

    // Check for existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { success: false, error: 'An account with this email already exists' },
        { status: 409 }
      );
    }

    // Create user (password hashed via pre-save hook)
    const user = await User.create({ name, email, password, role });

    const token = await signToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
      name: user.name,
    });

    await setAuthCookie(token);

    return NextResponse.json(
      {
        success: true,
        data: { user: user.toJSON(), token },
        message: 'Account created successfully',
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('[SIGNUP ERROR]', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
