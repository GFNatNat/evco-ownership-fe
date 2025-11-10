import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PROTECTED = ['/dashboard','/coowner','/staff','/admin'];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (!PROTECTED.some(p => pathname.startsWith(p))) return NextResponse.next();

  const token = req.cookies.get(process.env.AUTH_COOKIE || 'accessToken')?.value;
  if (!token) {
    const url = new URL('/login', req.url);
    url.searchParams.set('next', pathname);
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = { matcher: ['/((?!_next|favicon.ico).*)'] };
