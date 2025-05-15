import { neon } from "@neondatabase/serverless"
import { drizzle } from "drizzle-orm/neon-http"
import * as schema from "./schema"

// Create a SQL client with the Neon database URL
const sql = neon(process.env.DATABASE_URL || "")

// Create a Drizzle client with the SQL client and schema
export const db = drizzle(sql, { schema })

export async function testConnection() {
  try {
    await db.execute(`SELECT 1`)
    return true
  } catch (error) {
    console.error("Database connection test failed:", error)
    return false
  }
}
