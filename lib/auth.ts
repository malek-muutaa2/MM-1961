import type { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { db } from "@/lib/db"
import { users } from "@/lib/db/schema"
import { comparePassword } from "@/lib/auth-utils"
import { eq } from "drizzle-orm"

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  secret: process.env.STACK_SECRET_SERVER_KEY || "SUPER_SECRET_DO_NOT_USE_IN_PRODUCTION",
  pages: {
    signIn: "/login",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        try {
          // Simplified query to avoid potential issues
          const userResults = await db.select().from(users).where(eq(users.email, credentials.email))

          if (!userResults || userResults.length === 0) {
            console.log("No user found with email:", credentials.email)
            return null
          }

          const user = userResults[0]

          // Simple password check to avoid potential issues
          const isValidPassword = await comparePassword(credentials.password, user.password)

          if (!isValidPassword) {
            console.log("Invalid password for user:", credentials.email)
            return null
          }

          // Return only the necessary user data
          return {
            id: String(user.id),
            email: user.email,
            name: user.name || "User",
          }
        } catch (error) {
          console.error("Auth error:", error)
          return null
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
      }
      return session
    },
  },
}
