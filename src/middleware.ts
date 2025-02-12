import { auth } from "@/auth";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export default auth((req: NextRequest) => {
  const url = req.nextUrl;

  // 🔒 Safely access req.auth (may be undefined)
  const isLoggedIn = !!(req as any).auth?.user;
  const isOnLoginPage = url.pathname === "/login";
  const isOnDashboard = url.pathname.startsWith("/dashboard");

  console.log("✅ Middleware is running!");
  console.log("📌 Requested URL:", req.url);
  console.log("🔍 Authenticated:", isLoggedIn);

  // ✅ Redirect logged-in users away from login
  if (isLoggedIn && isOnLoginPage) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  // ✅ Redirect unauthenticated users away from dashboard
  if (!isLoggedIn && isOnDashboard) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/login", "/dashboard/:path*"], // ✅ Avoid matching /api routes
};
