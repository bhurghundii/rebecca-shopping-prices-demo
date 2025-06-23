import { NextRequest, NextResponse } from 'next/server';

const AUTH0_CLIENT_ID = process.env.AUTH0_CLIENT_ID!;
const AUTH0_ISSUER = process.env.AUTH0_ISSUER!;
const REDIRECT_URI = 'http://localhost:3000/api/auth/okta/callback';
const AUTH0_AUDIENCE = 'https://dev-488edk6fg841d8bj.uk.auth0.com/api/v2/';

// This endpoint will handle Okta login callback in the future
export async function GET() {
  const params = new URLSearchParams({
    client_id: AUTH0_CLIENT_ID,
    response_type: 'code',
    scope: 'openid profile email',
    redirect_uri: REDIRECT_URI,
    audience: AUTH0_AUDIENCE,
    state: 'dummy-state',
  });
  const auth0AuthUrl = `${AUTH0_ISSUER.replace(/\/$/, '')}/authorize?${params.toString()}`;
  return NextResponse.redirect(auth0AuthUrl);
}
