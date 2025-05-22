/* eslint-disable */
// @ts-nocheck

import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";
import { z } from "zod";

export const authOptions = {
  // ✅ Required for signing/verifying JWT & session cookies
  secret: process.env.NEXTAUTH_SECRET, // ✅ Match .env variable name

  session: {
    strategy: "jwt",
  },

  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const parsed = z
          .object({
            email: z.string().email(),
            password: z.string().min(6),
          })
          .safeParse(credentials);

        if (!parsed.success) throw new Error("Invalid email or password");

        const { email, password } = parsed.data;
        const user = await prisma.user.findUnique({ where: { email } });

        if (!user) throw new Error("User not found");
        const valid = await bcrypt.compare(password, user.password);
        if (!valid) throw new Error("Incorrect password");

        return {
          id: user.id,
          email: user.email,
        };
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.user = user;
      }
      return token;
    },
    async session({ session, token }) {
      session.user = token.user;
      return session;
    },
  },
};

export default NextAuth(authOptions);
