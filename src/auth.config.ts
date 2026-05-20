import type { NextAuthConfig } from "next-auth";
import type { JWT } from "next-auth/jwt";
import type { Session } from "next-auth";

// Edge-compatible config (no Prisma, no bcrypt).
// Used in middleware for JWT verification only.
export const authConfig = {
  session: { strategy: "jwt" as const },
  pages: {
    signIn: "/sign-in",
    error: "/sign-in",
  },
  providers: [],
  callbacks: {
    jwt({ token, user }: { token: JWT; user?: { id?: string } }) {
      if (user?.id) token.id = user.id;
      return token;
    },
    session({ session, token }: { session: Session; token: JWT }) {
      if (token?.id) (session.user as { id?: string }).id = token.id as string;
      return session;
    },
  },
} satisfies NextAuthConfig;
