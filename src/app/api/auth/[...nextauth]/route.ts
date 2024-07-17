// pages/api/auth/[...nextauth].ts
import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

const handler = NextAuth({
  secret: process.env.JWT_SECRET,
  providers: [
    CredentialsProvider({
      name: "Credentials",

      credentials: {
        identifier: { label: "Имя или Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        if (!credentials) return null;

        const user = await prisma.admin.findFirst({
          where: {
            OR: [
              { email: credentials.identifier },
              { name: credentials.identifier },
            ],
          },
        });

        if (user && bcrypt.compareSync(credentials.password, user.password)) {
          return { id: user.id, name: user.name, email: user.email };
        }

        return null;
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id.toString(); // Приведение к строке
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.id = Number(token.id); // Приведение к числу
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
});

export { handler as GET, handler as POST };
