import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    MONGODB_URI_exists: !!process.env.MONGODB_URI,
    JWT_SECRET_exists: !!process.env.JWT_SECRET,
    NODE_ENV: process.env.NODE_ENV,
  });
}
