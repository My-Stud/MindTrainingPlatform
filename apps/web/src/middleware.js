import { NextResponse } from 'next/server';

export function middleware(request) {
  const { pathname, searchParams } = request.nextUrl;
  const requestHeaders = new Headers(request.headers);
  let modified = false;

  if (pathname.startsWith('/games/') && searchParams.get('embed') === '1') {
    requestHeaders.set('x-embed-mode', '1');
    modified = true;
  }

  if (pathname.startsWith('/admin')) {
    requestHeaders.set('x-proxy-token', 'gag-internal-secret-proxy');
    modified = true;
  }

  if (modified) {
    return NextResponse.next({ request: { headers: requestHeaders } });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/games/:path*', '/admin/:path*', '/admin'],
};
