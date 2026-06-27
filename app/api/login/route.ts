import { NextResponse } from 'next/server';
import { authAdmin } from '@/lib/firebaseAdmin';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const idToken = body?.idToken;

    if (!idToken) {
      return NextResponse.json({ error: 'ID Token is missing.' }, { status: 400 });
    }


    const expiresIn = 60 * 60 * 24 * 14 * 1000; 


    const sessionCookie = await authAdmin.createSessionCookie(idToken, { expiresIn });


    const response = NextResponse.json(
      { status: 'success', message: 'Logged in successfully!' },
      { status: 200 }
    );

    response.cookies.set({
      name: '__session',
      value: sessionCookie,
      maxAge: expiresIn / 1000,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      sameSite: 'lax',
    });

    return response;

  } catch (error: any) {
    console.error('Error creating session cookie:', error);
    return NextResponse.json(
      { error: 'Unauthorized: Failed to create session cookie.', details: error.message },
      { status: 401 }
    );
  }
}