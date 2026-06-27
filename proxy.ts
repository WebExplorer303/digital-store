import { NextRequest, NextResponse } from 'next/server';

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionCookie = request.cookies.get('__session')?.value;

const isAuthPage = pathname === '/login' || pathname === '/sign-up' || pathname === '/forgot-password';
const isApiRoute = pathname.startsWith('/api/');
const isProductPage = pathname.startsWith('/products/');

    if (isAuthPage && sessionCookie) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  if (isAuthPage || isApiRoute || isProductPage || pathname.startsWith('/_next') || pathname === '/') {
  return NextResponse.next();
}

if (!sessionCookie) {
  return NextResponse.redirect(new URL('/?showLogin=true', request.url));
}

  try {
    const verifyResponse = await fetch(new URL('/api/verifySession', request.url), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${sessionCookie}`
      },
    });

    if (!verifyResponse.ok) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    return NextResponse.next();
  } catch (error) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|woff|woff2|ttf|map)$).*)',
  ],
};