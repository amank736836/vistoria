import { connectToDatabase } from "@/src/backend/lib/db";
import User from "@/src/backend/models/User";
import bcrypt from "bcryptjs";
import NextAuth, { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";

export const authOptions: NextAuthConfig = {
  providers: [
    Credentials({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "text",
          placeholder: "Enter your email",
        },
        password: {
          label: "Password",
          type: "password",
          placeholder: "Enter your password",
        },
      },
      async authorize(credentials) {
        if (!credentials.email) {
          throw new Error("Email is required");
        }

        if (!credentials.password) {
          throw new Error("Password is required");
        }

        await connectToDatabase();

        try {
          const user = await User.findOne({ email: credentials.email });

          if (!user) {
            throw new Error("No user found");
          }

          const isValid = await bcrypt.compare(
            user.password,
            credentials.password as string
          );

          if (!isValid) {
            throw new Error("Incorrect password");
          }

          return {
            id: user._id.toString(),
            email: user.email,
          };
        } catch (error) {
          throw new Error(`Failed to log in - ${error}`);
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }

      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
      }

      return session;
    },
    authorized: async ({ auth }) => {
      return !!auth;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  secret: process.env.AUTH_SECRET,
};

export const { handlers, signIn, signOut, auth } = NextAuth(authOptions);
