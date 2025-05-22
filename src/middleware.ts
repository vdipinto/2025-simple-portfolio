import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const isDashboard = pathname.startsWith("/dashboard");
    const isLoggedIn = !!req.nextauth.token;

    // Optional redirect if logged-in users try to hit /login (no matcher needed for this to work if redirect is done in component)
    if (isLoggedIn && pathname === "/login") {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

// ✅ Only apply auth middleware to dashboard paths
export const config = {
  matcher: ["/dashboard/:path*"], // ✅ no "/login" here
};
