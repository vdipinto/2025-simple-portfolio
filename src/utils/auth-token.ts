import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";

export async function getUserFromRequest(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  if (!token?.sub || !token?.email) return null;

  return {
    id: token.sub,
    email: token.email,
  };
}