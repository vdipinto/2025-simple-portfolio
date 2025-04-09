import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { authConfig } from "./auth.config";
import { z } from "zod";
import bcrypt from "bcryptjs"; // Use bcryptjs for serverless environments
import { prisma } from "@/lib/db"; // ✅ Use centralized Prisma instance

console.log("NEXTAUTH_SECRET:", process.env.NEXTAUTH_SECRET);
async function getUser(email: string) {
  console.log("🔥 Debugging Prisma Instance:", prisma);  // ✅ Check if Prisma is initialized
  
  const user = await prisma.user.findUnique({
    where: { email },
  });

  console.log("🧑‍💻 User found:", user);  // ✅ Check if user exists in the database

  return user;
}

export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        // Validate input with Zod
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials);

        if (!parsedCredentials.success) {
          throw new Error("Invalid email or password.");
        }

        const { email, password } = parsedCredentials.data;
        const user = await getUser(email);

        if (!user) {
          throw new Error("User not found.");
        }

        // Compare hashed passwords
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
          throw new Error("Incorrect password.");
        }

        // ✅ Now Prisma automatically generates `id` (no need to modify)
        return { id: user.id, email: user.email, name: `${user.firstName} ${user.lastName}` };
      },
    }),
  ],
});
