//src/server/auth.ts

import bcrypt from "bcryptjs";
import { getServerSession, type NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { audit } from "./audit";
import { findUniqueUser, findUserById } from "./user";
export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt", //(1)
    // session max duration 96 Hours
    maxAge: 96 * 60 * 60,
  },
  callbacks: {
    async jwt({ token, account, profile }: any) {
      if (account && account.type === "credentials") {
        //(2)
        token.userId = account.providerAccountId;

        // this is I'd that coming from authorize() callback
      }
      return token;
    },
    async session({ session, token, user }: any) {
      session.user.id = token.userId;
      //(3)
      const user2 = await findUserById(parseInt(token.userId));

      if (user2[0].isDisabled || user2[0].deleted_at !== null) {
        session.error = "Disableduser";
      }
      session.user.role = user2[0].role;

      return session;
    },
  },
  events: {
    async signIn(message) {
      await audit({
        event: "user.signin",
        event_description: "User signed in",
        targets: [{ label: "email", value: String(message.user.email) }],
        email :  message.user.email ? message.user.email : "",
      });


    },
    async signOut(message) {
      await audit({
        event: "user.signout",
        event_description: "User signed out",
        targets: [{ label: "email", value: String(message.token.email) }],
        email :  message.token.email ? message.token.email : "",

      });
    },
  },

  pages: {
    signIn: "/login", //(4) custom signin page path
  },
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "email", type: "text", placeholder: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        const { email, password } = credentials as {
          email: string;
          password: string;
        };
        const user2: any = await findUniqueUser(email);

        if (!user2[0]) {
          //(1)
          return null; //(2)
        } else if (user2[0].password) {
          const isMatch = await bcrypt.compare(password, user2[0]?.password);
          if (!isMatch) {
            // If the passwords do not match, return null to indicate unsuccessful authentication
            return null;
          }
        }
        const user: any = {
          id: user2[0].id,
          name: user2[0].name,
          email: user2[0].email,
          role: user2[0].role,
        };

        return user;
      },
    }),
  ],
};
export const getServerAuthSession = () => getServerSession(authOptions); //(6)
