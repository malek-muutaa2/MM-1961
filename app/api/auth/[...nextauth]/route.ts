import NextAuth from "next-auth"
import { authOptions } from "@/lib/auth"

// Create a handler with proper error handling
const handler = NextAuth(authOptions)

// Export the handler functions
export { handler as GET, handler as POST }
