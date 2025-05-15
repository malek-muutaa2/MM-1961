import type { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { db } from "./db"
import { users } from "./db/schema"
import { eq } from "drizzle-orm"
import { comparePassword } from "./auth-utils"

// Ensure NEXTAUTH_URL is set in production
if (process.env.NODE_ENV === "production" && !process.env.NEXTAUTH_URL) {
  throw new Error("Please provide NEXTAUTH_URL environment variable")
}

// Ensure NEXTAUTH_SECRET is set
if (!process.env.NEXTAUTH_SECRET) {
  throw new Error("Please provide NEXTAUTH_SECRET environment variable")
}

export const authOptions: NextAuthOptions = {
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
  pages: {
    signIn: "/login",
    error: "/auth/error",
  },
  callbacks: {
    async jwt({ token, user }) {
      try {
        if (user) {
          token.name = user.name
        }
        return token
      } catch (error) {
        console.error("JWT error:", error)
        return token
      }
    },
    async session({ session, token }) {
      try {
        if (session?.user) {
          session.user.name = token.name as string
        }
        return session
      } catch (error) {
        console.error("Session error:", error)
        return session
      }
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  debug: process.env.NODE_ENV === "development",
}

