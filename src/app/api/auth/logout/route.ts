import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  // Clear the user cookie
  const { origin } = new URL(req.url);
  const response = NextResponse.redirect(new URL('/', origin));
  response.cookies.set('user', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    expires: new Date(0),
    path: '/'
  });
  
  return response;
}
