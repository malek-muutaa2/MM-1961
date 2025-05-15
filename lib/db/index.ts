import { neon } from "@neondatabase/serverless"
import { drizzle } from "drizzle-orm/neon-http"
import * as schema from "./schema"

// Create a connection pool to the database
const sql = neon(process.env.DATABASE_URL!)

// Create a drizzle client with the connection and schema
export const db = drizzle(sql, { schema })
