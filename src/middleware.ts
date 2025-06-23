import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  // Check for authenticated user cookie
  const userCookie = request.cookies.get('user');
  
  // For API routes that need protection (like write operations to /api/items)
  if (request.method !== 'GET' && request.nextUrl.pathname === '/api/items') {
    if (!userCookie) {
      return new NextResponse(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }
  }
  
  // For admin routes (currently not used, but prepared for future)
  if (request.nextUrl.pathname.startsWith('/admin') && !userCookie) {
    const signInUrl = new URL('/signin', request.url);
    signInUrl.searchParams.set('from', request.nextUrl.pathname);
    return NextResponse.redirect(signInUrl);
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/api/items']
};
