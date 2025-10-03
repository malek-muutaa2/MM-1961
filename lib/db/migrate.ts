// import { migrate } from "drizzle-orm/neon-http/migrator"
import { migrate } from "drizzle-orm/node-postgres/migrator"
import { db } from "./dbpostgres"

// This script will run the migrations on the database
async function main() {
  console.log("Running migrations...")

  try {
    // if use neon db ensure to use the correct migrate import and correct db instance (by neon)
    await migrate(db, { migrationsFolder: "drizzle" })
    console.log("Migrations completed successfully")
  } catch (error) {
    console.error("Error running migrations:", error)
    process.exit(1)
  }

  process.exit(0)
}

main()
