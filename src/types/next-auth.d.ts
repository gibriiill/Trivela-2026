import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      username: string;
      role: "USER" | "ADMIN";
      totalPoints: number;
    } & DefaultSession["user"];
  }
}
