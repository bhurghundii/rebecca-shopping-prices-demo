import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  console.log('Auth callback route triggered');
  const { searchParams, origin } = new URL(req.url);
  const code = searchParams.get('code');
  const state = searchParams.get('state');
  
  if (!code) {
    console.error('Missing authorization code');
    return NextResponse.redirect(new URL('/signin?error=missing_code', origin));
  }
  
  try {
    // Log environment variables (sanitized)
    console.log('Auth0 Domain:', process.env.NEXT_PUBLIC_AUTH0_DOMAIN ? '✓ Set' : '✗ Missing');
    console.log('Auth0 Client ID:', process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID ? '✓ Set' : '✗ Missing');
    console.log('Auth0 Client Secret:', process.env.AUTH0_CLIENT_SECRET ? '✓ Set' : '✗ Missing');
    
    const tokenURL = `https://${process.env.NEXT_PUBLIC_AUTH0_DOMAIN}/oauth/token`;
    console.log('Token URL:', tokenURL);
    
    const tokenBody = new URLSearchParams({
      grant_type: 'authorization_code',
      client_id: process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID || '',
      client_secret: process.env.AUTH0_CLIENT_SECRET || '',
      code,
      redirect_uri: "http://localhost:3000/api/auth/callback"
    });
    
    console.log('Making token request...');
    const tokenResponse = await fetch(tokenURL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: tokenBody.toString()
    });
    
    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      console.error('Token exchange failed:', errorText);
      return NextResponse.redirect(new URL('/signin?error=token_exchange', origin));
    }
    
    console.log('Token exchange successful');
    const tokenData = await tokenResponse.json();
    
    if (!tokenData.id_token) {
      console.error('No ID token in response:', Object.keys(tokenData));
      return NextResponse.redirect(new URL('/signin?error=missing_id_token', origin));
    }
    
    try {
      // Parse the ID token payload (middle part of JWT)
      const parts = tokenData.id_token.split('.');
      if (parts.length !== 3) {
        throw new Error('Invalid JWT format');
      }
      
      // Base64 decode and parse as JSON
      const base64Payload = parts[1].replace(/-/g, '+').replace(/_/g, '/');
      const payload = JSON.parse(
        Buffer.from(base64Payload, 'base64').toString('utf8')
      );
      
      console.log('ID token decoded successfully, user:', payload.sub);
      
      // Set a cookie with user info
      const response = NextResponse.redirect(new URL('/', origin));
      response.cookies.set('user', JSON.stringify({
        sub: payload.sub,
        email: payload.email,
        name: payload.name,
        picture: payload.picture
      }), {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60, // 1 hour
        path: '/'
      });
      
      return response;
    } catch (parseError) {
      console.error('Failed to parse ID token:', parseError);
      return NextResponse.redirect(new URL('/signin?error=invalid_token', origin));
    }
  } catch (error) {
    console.error('Auth callback error:', error);
    return NextResponse.redirect(new URL('/signin?error=server_error', origin));
  }
}
