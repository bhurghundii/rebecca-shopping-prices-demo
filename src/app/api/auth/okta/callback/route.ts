import { NextRequest, NextResponse } from 'next/server';

const AUTH0_CLIENT_ID = process.env.AUTH0_CLIENT_ID!;
const AUTH0_CLIENT_SECRET = process.env.AUTH0_CLIENT_SECRET!;
const AUTH0_ISSUER = process.env.AUTH0_ISSUER!;
const REDIRECT_URI = 'http://localhost:3000/api/auth/okta/callback';
const AUTH0_AUDIENCE = 'https://dev-488edk6fg841d8bj.uk.auth0.com/api/v2/';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get('code');
  if (!code) {
    return NextResponse.json({ error: 'Missing code' }, { status: 400 });
  }

  // Exchange code for tokens
  const tokenRes = await fetch(`${AUTH0_ISSUER}/oauth/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: REDIRECT_URI,
      client_id: AUTH0_CLIENT_ID,
      client_secret: AUTH0_CLIENT_SECRET,
      audience: AUTH0_AUDIENCE,
    }),
  });
  if (!tokenRes.ok) {
    return NextResponse.json({ error: 'Token exchange failed' }, { status: 401 });
  }
  const tokenData = await tokenRes.json();

  // Decode the ID token (JWT) to get user info
  const idToken = tokenData.id_token;
  // In production, verify the JWT signature and claims!
  const base64Payload = idToken.split('.')[1];
  const payload = JSON.parse(Buffer.from(base64Payload, 'base64').toString());

  // Set a session cookie (for demo, just user info; use secure cookies in production)
  const { origin } = new URL(req.url);
  const response = NextResponse.redirect(new URL('/', origin));
  response.cookies.set('user', JSON.stringify({ email: payload.email, name: payload.name, sub: payload.sub }), {
    httpOnly: false,
    path: '/',
  });
  return response;
}
