import { NextResponse } from "next/server"
import { withAuth } from "next-auth/middleware"

// Export the middleware function
export default withAuth(
  function middleware(req) {
    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  },
)

// Specify which routes this middleware should run on
export const config = {
  matcher: [
    "/dashboard/:path*",
    "/profile/:path*",
    "/settings/:path*",
    "/rafed-provider/:path*",
    "/rafed-admin/:path*",
  ],
}
