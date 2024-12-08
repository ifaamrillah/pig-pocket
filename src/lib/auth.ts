import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";

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
});
