import type { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      username: string;
      role: "USER" | "ADMIN";
      totalPoints: number;
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    username: string;
    role: "USER" | "ADMIN";
    totalPoints: number;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    username: string;
    role: "USER" | "ADMIN";
    totalPoints: number;
  }
}
