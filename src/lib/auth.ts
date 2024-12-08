import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  providers: [
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
    authorized({ auth, request: { nextUrl } }) {
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
  },
});
