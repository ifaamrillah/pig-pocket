/* eslint-disable @typescript-eslint/no-unused-vars */
import { type DefaultSession } from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: User & DefaultSession["user"];
  }

  interface User {
    role: string;
    plan: string;
    expiredPlan: Date;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    sub: string;
    role: string;
    plan: string;
    expiredPlan: Date;
  }
}
