import { pgTable, serial, varchar, timestamp, text } from "drizzle-orm/pg-core"

// Users table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
  jobTitle: varchar("job_title", { length: 100 }),
  department: varchar("department", { length: 100 }),
  workDomain: varchar("work_domain", { length: 100 }),
  organization: varchar("organization", { length: 255 }),
  bio: text("bio"),
  image: text("image"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

// Export types
export type User = typeof users.$inferSelect
export type NewUser = typeof users.$inferInsert
