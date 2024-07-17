import NextAuth from "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    id: number;
  }

  interface User {
    id: number;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
  }
}
