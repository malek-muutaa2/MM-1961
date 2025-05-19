import { migrate } from "drizzle-orm/neon-http/migrator"
import { db } from "./dbpostgres"

// This script will run the migrations on the database
async function main() {
  console.log("Running migrations...")

  try {
    await migrate(db, { migrationsFolder: "drizzle" })
    console.log("Migrations completed successfully")
  } catch (error) {
    console.error("Error running migrations:", error)
    process.exit(1)
  }

  process.exit(0)
}

main()
