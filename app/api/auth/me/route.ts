import { NextRequest, NextResponse } from 'next/server';
import { clearAuthCookie, getAuthUser } from '@/lib/auth';
import { connectDB } from '@/lib/db';
import { User } from '@/models/User';

// GET /api/auth/me — returns current user from token
export async function GET(req: NextRequest) {
  try {
    const payload = await getAuthUser(req);
    if (!payload) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const user = await User.findById(payload.userId);
    if (!user) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: user.toJSON() });
  } catch (error) {
    console.error('[ME ERROR]', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/auth/logout — clears the auth cookie
export async function POST() {
  await clearAuthCookie();
  return NextResponse.json({ success: true, message: 'Logged out' });
}
