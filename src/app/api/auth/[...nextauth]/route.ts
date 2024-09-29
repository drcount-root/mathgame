import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import fs from "fs/promises";
import path from "path";

// Path to db.json
const dbPath = path.join(process.cwd(), "src/db/db.json");

async function readDB() {
  const data = await fs.readFile(dbPath, "utf-8");
  return JSON.parse(data);
}

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials: any) {
        try {
          const db = await readDB();
          const user = db.users.find(
            (user: any) => user.email === credentials?.email
          );

          if (!user) {
            throw new Error("No user found");
          }

          const isValidPassword = await bcrypt.compare(
            credentials?.password,
            user.password
          );

          if (!isValidPassword) {
            throw new Error("Invalid password");
          }

          return { id: user.id, name: user.name, email: user.email };
        } catch (error) {
          console.error("Authorization error:", error); // Log the error
          throw new Error("Login failed");
        }
      },

      //   async authorize(credentials: any) {
      //     console.log("Login attempt for:", credentials);
      //     const db = await readDB();

      //     // Find user by email
      //     const user = db.users.find(
      //       (user: any) => user.email === credentials?.email
      //     );
      //     if (!user) {
      //       throw new Error("No user found");
      //     }

      //     // Check if password is correct
      //     const isValidPassword = await bcrypt.compare(
      //       credentials?.password,
      //       user.password
      //     );
      //     if (!isValidPassword) {
      //       throw new Error("Invalid password");
      //     }

      //     // Return user object (omit password)
      //     return { id: user.id, name: user.name, email: user.email };
      //   },
    }),
  ],
  pages: {
    signIn: "/login", // Redirect to login page
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }: any) {
      session.user.id = token.id;
      return session;
    },
  },
});

export { handler as GET, handler as POST };
