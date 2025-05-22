import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request })
  const isAuthenticated = !!token
    const { pathname } = request.nextUrl
    if (pathname.startsWith("/login/new-password")) {
    return NextResponse.next()
  }
  // Public paths that don't require authentication
  const publicPaths = ["/login", "/register","/recovery","/login/new-password"]
  const isPublicPath = publicPaths.some((path) => request.nextUrl.pathname.startsWith(path))
if (!isAuthenticated) {
    if (request.nextUrl.pathname.startsWith("/api")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }
  // If the user is not authenticated and trying to access a protected route
  if (!isAuthenticated && !isPublicPath) {
    const url = new URL("/login", request.url)
    url.searchParams.set("callbackUrl", request.nextUrl.pathname)
    return NextResponse.redirect(url)
  }

  // If the user is authenticated and trying to access a public route
  if (isAuthenticated && isPublicPath) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
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
