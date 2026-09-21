import "server-only";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";

if (process.env.NODE_ENV === "production") {
  const presence = (key: string) => {
    const value = process.env[key];
    const set = value != null && value !== "";
    return { set, length: set ? String(value).length : 0 };
  };
  const trustHostResolved = Boolean(
    process.env.AUTH_URL ??
      process.env.AUTH_TRUST_HOST ??
      process.env.VERCEL ??
      process.env.CF_PAGES ??
      process.env.NODE_ENV !== "production",
  );
  console.log(
    "[auth-diag] init",
    JSON.stringify({
      node: process.version,
      AUTH_SECRET: presence("AUTH_SECRET"),
      NEXTAUTH_SECRET: presence("NEXTAUTH_SECRET"),
      AUTH_TRUST_HOST: presence("AUTH_TRUST_HOST"),
      AUTH_URL: { set: process.env.AUTH_URL != null },
      NEXTAUTH_URL: { set: process.env.NEXTAUTH_URL != null },
      VERCEL: presence("VERCEL"),
      DATABASE_URL: { set: process.env.DATABASE_URL != null },
      trustHostResolved,
    }),
  );
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: "jwt" },
  trustHost: true,
  pages: { signIn: "/login" },
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials) => {
        const email =
          typeof credentials?.email === "string"
            ? credentials.email.trim().toLowerCase()
            : "";
        const password =
          typeof credentials?.password === "string"
            ? credentials.password
            : "";
        if (!email || !password) return null;

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) return null;

        const valid = await bcrypt.compare(password, user.passwordHash);
        if (!valid) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.name ?? undefined,
          image: null,
        };
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user?.id) token.id = user.id;
      if (user?.name) token.name = user.name;
      return token;
    },
    session({ session, token }) {
      if (token.id) session.user.id = token.id as string;
      if (token.email) session.user.email = token.email as string;
      if (token.name) session.user.name = token.name as string;
      return session;
    },
  },
});