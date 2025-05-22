declare module "next-auth" {
    interface User {
      id: string;
      email?: string | null;    // <-- Allow email to be optional or null to match NextAuth core User type
      emailVerified?: Date | null;
    }
  
    interface Session {
      user: {
        id: string;
        email?: string | null;  // Same here
        emailVerified?: Date | null;
      };
    }
  }
  
  declare module "next-auth/jwt" {
    interface JWT {
      user?: {
        id: string;
        email?: string | null;  // Keep nullable consistent here too
        emailVerified?: Date | null;
      };
    }
  }
