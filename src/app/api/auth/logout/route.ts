import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  // Clear the user cookie
  const { origin } = new URL(req.url);
  const response = NextResponse.redirect(new URL('/', origin));
  response.cookies.set('user', '', {
    httpOnly: false, // Match the same setting as when we set the cookie
    secure: process.env.NODE_ENV === 'production',
    expires: new Date(0),
    path: '/'
  });
  
  return response;
}
