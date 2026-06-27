import { NextRequest, NextResponse } from 'next/server';
import { authAdmin } from '@/lib/firebaseAdmin';

export async function POST(req: NextRequest) {
  const authHeader = req.headers.get('authorization');
  const sessionCookie = authHeader?.split('Bearer ')[1];

  if (!sessionCookie) {
    return NextResponse.json(
      { error: 'No session cookie provided in Authorization header.' },
      { status: 401 }
    );
  }

  try {
    const decodedClaims = await authAdmin.verifySessionCookie(sessionCookie, true); 

    return NextResponse.json(
      { status: 'success', uid: decodedClaims.uid, claims: decodedClaims },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error verifying session cookie:', error);

    return NextResponse.json(
      { error: 'Invalid or expired session cookie.', details: error.message },
      { status: 401 }
    );
  }
}