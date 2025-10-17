import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request })
  
    const { pathname } = request.nextUrl
      if (pathname.startsWith("/images/")) {
    return NextResponse.next()
  }
    if (pathname.startsWith("/login/new-password")) {
    return NextResponse.next()
    
  }
   if (request.nextUrl.pathname.startsWith(`/recovery`)) {
    return NextResponse.next();
  }

  if (!token) {
    if (request.nextUrl.pathname.startsWith("/api")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if(!request?.url) {
      return NextResponse.json({ error: "Invalid request URL" }, { status: 400 })
    }
    return NextResponse.rewrite(new URL(`/login`, request.url));
  }
  if (token && request.nextUrl.pathname.startsWith(`/login`)) {
    if(!request?.url) {
      return NextResponse.json({ error: "Invalid request URL" }, { status: 400 })
    }
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    // Match all paths except for:
    // - API routes
    // - Static files
    // - _next (Next.js internals)
    "/((?!api|_next/static|_next/image|muutaa-logo.png|favicon.ico).*)",
  ],
}
