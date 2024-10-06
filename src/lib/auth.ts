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
          if (!user) {
            throw new Error("No user found with that email");
          }

          // Check password validity
          const isValidPassword = await bcrypt.compare(
            credentials?.password,
            user.password
          );
          if (!isValidPassword) {
            throw new Error("Incorrect password");
          }

          // Return the user without password
          return {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            scores: user.scores || [],
            totalScore: user.totalScore || 0,
          };
        } catch (error: any) {
          console.error("Authorization error:", error.message);
          throw new Error(error.message); // Pass the error message back
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
        console.log("user", user);
        token.id = user.id;
        token.scores = user.scores || [];
        token.totalScore = user.totalScore || 0;
      }

      // This will trigger whenever the session is updated, ensure token holds updated scores & totalScore
      if (token.id) {
        const dbUser = await User.findById(token.id);
        token.scores = dbUser?.scores || []; // Fetch updated scores from the database
        token.totalScore = dbUser?.totalScore || 0; // Fetch updated totalScore from the database
      }
      return token;
    },
    // Attach JWT token info into the session object
    async session({ session, token }: any) {
      session.user.id = token.id;
      session.user.scores = token.scores;
      session.user.totalScore = token.totalScore;
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET || "secr3t",
};
