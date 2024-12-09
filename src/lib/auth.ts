import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import type { Adapter } from "next-auth/adapters";
import { NextResponse } from "next/server";
import Google from "next-auth/providers/google";

import { prisma } from "@/lib/prisma";
import { FREE_PLAN_DURATION } from "./constants";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma) as Adapter,
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
    Credentials({
      credentials: {
        email: {},
      },
      authorize: async (credentials) => {
        const { email } = credentials;

        const user = await prisma.user.findUnique({
          where: {
            email: email as string,
          },
        });

        return user;
      },
    }),
  ],
  callbacks: {
    async signIn({ account, profile, user }) {
      if (account?.provider === "google") {
        const email = profile?.email;

        const existingUser = await prisma.user.findUnique({
          where: { email: email as string },
        });

        if (existingUser) {
          const linkedAccount = await prisma.account.findFirst({
            where: {
              provider: "google",
              providerAccountId: account.providerAccountId,
              userId: existingUser.id,
            },
          });

          if (!linkedAccount) {
            await prisma.account.create({
              data: {
                userId: existingUser.id,
                type: account.type,
                provider: account.provider,
                providerAccountId: account.providerAccountId,
                refresh_token: account.refresh_token,
                access_token: account.access_token,
                expires_at: account.expires_at,
              },
            });
          }

          user.id = existingUser.id;

          return true;
        }

        const expiredPlan = new Date(Date.now() + FREE_PLAN_DURATION);

        const newUser = await prisma.user.create({
          data: {
            name: profile?.name,
            email: profile?.email,
            emailVerified: new Date(),
            image: profile?.picture,
            expiredPlan,
            accounts: {
              create: {
                type: account.type,
                provider: account.provider,
                providerAccountId: account.providerAccountId,
                refresh_token: account.refresh_token,
                access_token: account.access_token,
                expires_at: account.expires_at,
              },
            },
          },
        });

        user.id = newUser.id;
        return true;
      }
      return true;
    },
    async authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const currentPath = nextUrl.pathname;

      const publicRoutes = ["/about"];
      const authRoutes = ["/login", "/register"];

      const isApiRoute = currentPath.startsWith("/api");
      const isPublicRoute = publicRoutes.includes(currentPath);
      const isAuthRoute = authRoutes.includes(currentPath);
      const isProtectedRoute = !isPublicRoute && !isAuthRoute;

      if (isApiRoute) return true;

      if (isProtectedRoute && !isLoggedIn) {
        return NextResponse.redirect(new URL("/login", nextUrl));
      }

      if (isAuthRoute && isLoggedIn) {
        return NextResponse.redirect(new URL("/", nextUrl));
      }

      return true;
    },
    async jwt({ token, user }) {
      if (!token.sub) return token;

      if (user) {
        token.role = user.role;
        token.plan = user.plan;
        token.expiredPlan = user.expiredPlan;
      }

      return token;
    },
    async session({ token, session }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }

      if (token.role && session.user) {
        session.user.role = token.role;
        session.user.plan = token.plan;
        session.user.expiredPlan = token.expiredPlan;
      }

      return session;
    },
  },
});
