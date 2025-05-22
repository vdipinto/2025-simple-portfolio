import Credentials from "next-auth/providers/credentials";
import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";
import type { User, Session } from "next-auth";
import type { JWT } from "next-auth/jwt";

export const authConfig = {
  session: {
    strategy: "jwt",
  },

  callbacks: {
    async jwt({ token, user }: { token: JWT & { user?: User }; user?: User }) {
      if (user) {
        token.user = {
          id: user.id,
          email: user.email,
          emailVerified: user.emailVerified ?? null,
        };
      }
      return token;
    },

    async session({ session, token }: { session: Session; token: JWT & { user?: User } }) {
      if (token.user) {
        session.user = {
          id: token.user.id,
          email: token.user.email,
          emailVerified: token.user.emailVerified ?? null,
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

      async authorize(credentials: { email?: string; password?: string } | undefined): Promise<User | null> {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Missing email or password");
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

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
          emailVerified: user.emailVerified ?? null,
        };
      },
    }),
  ],
};
