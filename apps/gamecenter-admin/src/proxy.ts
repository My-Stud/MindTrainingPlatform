import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  // Direct access block removed for Hostinger deployment

  // Skip auth checks for static assets and API routes, but keep the proxy check above!
  const isStaticAsset = request.nextUrl.pathname.startsWith('/_next') || 
                        request.nextUrl.pathname.startsWith('/api') || 
                        request.nextUrl.pathname === '/favicon.ico';
                        
  if (isStaticAsset) {
    return NextResponse.next();
  }

  const token = request.cookies.get("admin_token")?.value;
  const refreshToken = request.cookies.get("refresh_token")?.value;

  const isLoginPage = request.nextUrl.pathname === "/login";
  const clearSession = request.nextUrl.searchParams.get("clear_session") === "true";

  if (clearSession) {
    const url = new URL(request.url);
    url.searchParams.delete("clear_session");
    const response = NextResponse.redirect(url);
    response.cookies.delete("admin_token");
    response.cookies.delete("refresh_token");
    return response;
  }

  if (!token && !refreshToken && !isLoginPage) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  if (token && isLoginPage) {
    return NextResponse.redirect(new URL("/admin/projects", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/:path*"
  ],
};
