import { neon } from "@neondatabase/serverless"
import { drizzle } from "drizzle-orm/neon-http"
import * as schema from "./schema"

// Create a SQL client with the Neon database URL
const sql = neon(process.env.DATABASE_URL!)

// Create a Drizzle client with the SQL client and schema
export const db = drizzle(sql, { schema })

// Simple function to test the database connection
export async function testConnection() {
  try {
    const result = await sql`SELECT 1 as test`
    return result[0].test === 1
  } catch (error) {
    console.error("Database connection error:", error)
    return false
  }
}
