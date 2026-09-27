import NextAuth, { type DefaultSession } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { z } from "zod";
import { medusa, isMedusaConfigured } from "@/lib/medusa/client";
import { roleForEmail, type Role } from "@/lib/auth-guard";

declare module "next-auth" {
  interface Session {
    medusaToken?: string;
    user: { id: string; role: Role } & DefaultSession["user"];
  }
}

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: "jwt", maxAge: 60 * 60 * 24 * 7 },
  pages: { signIn: "/login" },
  providers: [
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? [Google({ clientId: process.env.GOOGLE_CLIENT_ID, clientSecret: process.env.GOOGLE_CLIENT_SECRET })]
      : []),
    Credentials({
      name: "Email & password",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(raw) {
        const parsed = credentialsSchema.safeParse(raw);
        if (!parsed.success || !isMedusaConfigured) return null;

        try {
          const token = await medusa.auth.login("customer", "emailpass", parsed.data);
          if (typeof token !== "string") return null; // MFA/redirect flows unsupported here

          const { customer } = await medusa.store.customer.retrieve(
            {},
            { Authorization: `Bearer ${token}` }
          );

          return {
            id: customer.id,
            email: customer.email,
            name:
              [customer.first_name, customer.last_name].filter(Boolean).join(" ") ||
              customer.email,
            medusaToken: token,
          };
        } catch {
          return null;
        }
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
        token.medusaToken = (user as { medusaToken?: string }).medusaToken;
        token.role = roleForEmail(user.email);
      }
      return token;
    },
    session({ session, token }) {
      if (token.sub) session.user.id = token.sub;
      session.user.role = (token.role as Role | undefined) ?? roleForEmail(session.user.email);
      session.medusaToken = token.medusaToken as string | undefined;
      return session;
    },
  },
  secret: process.env.AUTH_SECRET,
  trustHost: true,
});
