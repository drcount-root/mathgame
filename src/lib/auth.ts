import connectMongo from "@/lib/mongodb";
import { User } from "@/models/User";
import bcrypt from "bcryptjs";
import CredentialsProvider from "next-auth/providers/credentials";
import { NextAuthOptions } from "next-auth";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials: any) {
        try {
          await connectMongo();

          // Fetch the user from the database
          const user = await User.findOne({ email: credentials?.email });
          if (!user) throw new Error("No user found");

          // Check password validity
          const isValidPassword = await bcrypt.compare(
            credentials?.password,
            user.password
          );
          if (!isValidPassword) throw new Error("Invalid password");

          // Return the user without password
          return {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            scores: user.scores || [],
          };
        } catch (error) {
          console.error("Authorization error:", error);
          return null; // Null will result in failed login
        }
      },
    }),
  ],
  pages: {
    signIn: "/login", // Customize your login page
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    // Attach user info into JWT token
    async jwt({ token, user }: any) {
      if (user) {
        token.id = user.id;
        token.scores = user.scores || [];
      }
      return token;
    },
    // Attach JWT token info into the session object
    async session({ session, token }: any) {
      session.user.id = token.id;
      session.user.scores = token.scores;
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET || "secr3t",
};
