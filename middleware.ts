import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

const adminPath = "/admin"
const authPaths = ["/login", "/register"]

export default withAuth(
  async function middleware(req) {
    const url = req.nextUrl.clone()
    const pathname = req.nextUrl.pathname
    const token = req.nextauth.token

    // Check if user is logged in
    const isLoggedIn = !!token
    // Get role from token - ensure it's properly typed
    const userRole = token?.role as string | undefined
    console.log("Middleware - Token:", token)
    console.log("Middleware - UserRole:", userRole)

    // If user is logged in, prevent access to login/register pages
    if (isLoggedIn && authPaths.some(path => pathname === path || pathname.startsWith(path + "/"))) {
      // Redirect to dashboard based on role
      if (userRole === "Admin") {
        url.pathname = "/admin"
      } else {
        url.pathname = "/dashboard"
      }
      return NextResponse.redirect(url)
    }

    // Admin route protection - ONLY allow Admin role
    if (pathname.startsWith(adminPath)) {
      console.log("Admin path check - Role:", userRole)
      // Only allow if role is exactly "Admin"
      if (userRole !== "Admin") {
        // If not logged in or not Admin, redirect
        if (!isLoggedIn) {
          url.pathname = "/login"
        } else {
          // Regular user trying to access admin
          url.pathname = "/dashboard"
        }
        return NextResponse.redirect(url)
      }
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      // Only require authentication, role check is done in middleware function
      authorized: ({ token }) => !!token
    }
  }
)

export const config = {
  matcher: [
    "/admin/:path*",
    "/login/:path*",
    "/register/:path*"
  ]
}