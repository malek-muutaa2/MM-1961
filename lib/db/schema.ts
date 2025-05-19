import { pgTable, serial, varchar, timestamp, text, pgEnum, boolean, integer, json } from "drizzle-orm/pg-core"

// Users table
export const user_enum_role = pgEnum("role", [
  "Admin",
  "User",

]);
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
  role: user_enum_role("role").notNull().default("User"),

  jobTitle: varchar("job_title", { length: 100 }),
  department: varchar("department", { length: 100 }),
  workDomain: varchar("work_domain", { length: 100 }),
  organization: varchar("organization", { length: 255 }),
  bio: text("bio"),
  image: text("image"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  deleted_at: timestamp("deleted_at"),
  resetpasswordtoken: varchar("resetpasswordtoken"),
  passwordresettokenexpiry: timestamp("passwordresettokenexpiry"),
  passwordupdatedat: timestamp("passwordupdatedat"),
  isDisabled: boolean("isDisabled"),


})
export const audit_log = pgTable("audit_log", {
  id: serial("id").notNull(),
  timestamp: timestamp("timestamp", { mode: "string" }).notNull(),
  actor: varchar("actor", { length: 255 }).notNull(),
  event: varchar("event", { length: 255 }).notNull(),
  event_description: text("event_description").notNull(),
  targets: json("targets").notNull(),
  client: json("client"),
});

export const twoFactorAuth = pgTable("two_factor_auth", {
  // One-to-one relation with users table

  userId: integer("user_id").primaryKey().references(() => users.id),

  // Token for confirming 2FA actions (e.g., email/SMS code)
  twoFactorToken: varchar("two_factor_token", { length: 255 }),

  // Expiry for the above token
  twoFactorTokenExpiry: timestamp("two_factor_token_expiry"),

  // Secret key used by TOTP generators (Google Authenticator, Authy, etc.)
  totpSecret: varchar("totp_secret", { length: 255 }),

  // Toggle indicating whether 2FA is enabled for this user
  isTwoFactorEnabled: boolean("is_two_factor_enabled").notNull().default(false),
});

// Export types
export type UserType = typeof users.$inferSelect
export type NewUser = typeof users.$inferInsert
