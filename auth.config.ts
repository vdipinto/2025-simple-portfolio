import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials"; // ✅ Import credentials provider
import { prisma } from "@/lib/db"; // ✅ Ensure Prisma is set up
import bcrypt from "bcryptjs"; // ✅ Use bcrypt for password hashing

export const authConfig = {
  pages: {
    signIn: "/login",
  },

  session: {
    strategy: "jwt",
  },

  cookies: {
    sessionToken: {
      name: "next-auth.session-token",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.user = {
          id: user.id,
          email: user.email,
          emailVerified: user.emailVerified || null,
        };
      }
      return token;
    },

    async session({ session, token }) {
      if (token?.user) {
        session.user = {
          id: token.user.id,
          email: token.user.email,
          emailVerified: token.user.emailVerified || null,
        };
      }
      return session;
    },
  },

  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "example@example.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Missing email or password");
        }

        const user = await prisma.user.findUnique({ where: { email: credentials.email } });
        if (!user) {
          throw new Error("User not found");
        }

        const isValidPassword = await bcrypt.compare(credentials.password, user.password);
        if (!isValidPassword) {
          throw new Error("Incorrect password");
        }

        return {
          id: user.id,
          email: user.email,
          emailVerified: user.emailVerified || null,
        };
      },
    }),
  ],
} satisfies NextAuthConfig;

