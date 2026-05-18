import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { User } from '@/models/User';
import { getAuthUser } from '@/lib/auth';

// PATCH /api/profile — update authenticated user's name and bio
export async function PATCH(req: NextRequest) {
  try {
    const authUser = await getAuthUser(req);
    if (!authUser) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const body = await req.json();
    const { name, bio } = body;

    const updates: Record<string, string> = {};
    if (name && typeof name === 'string' && name.trim().length >= 2) {
      updates.name = name.trim().slice(0, 50);
    }
    if (bio !== undefined && typeof bio === 'string') {
      updates.bio = bio.trim().slice(0, 500);
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json(
        { success: false, error: 'No valid fields to update' },
        { status: 400 }
      );
    }

    const updatedUser = await User.findByIdAndUpdate(
      authUser.userId,
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: updatedUser.toJSON(),
      message: 'Profile updated successfully',
    });
  } catch (error) {
    console.error('[PROFILE UPDATE ERROR]', error);
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}
