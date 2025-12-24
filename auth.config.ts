/* eslint-disable @typescript-eslint/no-unused-vars */
import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { Role } from "@prisma/client";

export default {
  providers: [
    Credentials({
      async authorize(_credentials) {
        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token }) {
      return token;
    },
    async session({ session, token }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }

      if (token.role && session.user) {
        session.user.role = token.role as Role;
      }

      return session;
    },
  },
} satisfies NextAuthConfig;
