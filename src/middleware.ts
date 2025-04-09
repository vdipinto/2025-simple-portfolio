import { NextResponse } from "next/server";
import { auth } from "@/auth"; // ✅ Import NextAuth authentication

export default async function middleware(req: Request) {
  console.log("✅ Middleware is running!");
  console.log("📌 Requested URL:", req.url);

  const session = await auth(); // ✅ Fetch session from NextAuth
  const url = new URL(req.url);

  console.log("🔍 Session Data:", session);

  const isLoggedIn = !!session?.user;
  const isOnLoginPage = url.pathname === "/login";
  const isOnDashboard = url.pathname.startsWith("/dashboard");

  // ✅ Redirect logged-in users away from `/login` to `/dashboard`
  if (isLoggedIn && isOnLoginPage) {
    console.log("🚀 Redirecting logged-in user to /dashboard...");
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  // ✅ Redirect unauthenticated users away from `/dashboard` to `/login`
  if (!isLoggedIn && isOnDashboard) {
    console.log("⛔ Redirecting unauthenticated user to /login...");
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

// ✅ Apply middleware to `/login` and `/dashboard`
export const config = {
  matcher: ["/login", "/dashboard/:path*"],
};
