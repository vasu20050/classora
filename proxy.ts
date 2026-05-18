import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';

// Paths that require authentication
const PROTECTED_PATHS = ['/dashboard', '/classroom', '/assignments', '/profile'];

// Paths that should redirect to dashboard if already logged in
const AUTH_PATHS = ['/login', '/signup'];

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const token =
    req.cookies.get('auth_token')?.value ||
    req.headers.get('authorization')?.replace('Bearer ', '');

  const user = token ? await verifyToken(token) : null;

  const isProtected = PROTECTED_PATHS.some((path) => pathname.startsWith(path));
  const isAuthPath = AUTH_PATHS.some((path) => pathname.startsWith(path));

  // Redirect unauthenticated users away from protected pages
  if (isProtected && !user) {
    const url = req.nextUrl.clone();
    url.pathname = '/login';
    url.searchParams.set('redirect', pathname);
    return NextResponse.redirect(url);
  }

  // Redirect authenticated users away from login/signup
  if (isAuthPath && user) {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/classroom/:path*',
    '/assignments/:path*',
    '/profile/:path*',
    '/login',
    '/signup',
  ],
};
