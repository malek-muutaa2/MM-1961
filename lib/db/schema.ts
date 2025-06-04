import {
  pgTable,
  serial,
  varchar,
  timestamp,
  text,
  pgEnum,
  boolean,
  integer,
  json,
  index,
  numeric,
  date,
} from "drizzle-orm/pg-core"
import { relations } from "drizzle-orm"

// Users table
export const user_enum_role = pgEnum("role", ["Admin", "User"])
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
})

export const twoFactorAuth = pgTable("two_factor_auth", {
  // One-to-one relation with users table

  userId: integer("user_id")
    .primaryKey()
    .references(() => users.id),

  // Token for confirming 2FA actions (e.g., email/SMS code)
  twoFactorToken: varchar("two_factor_token", { length: 255 }),

  // Expiry for the above token
  twoFactorTokenExpiry: timestamp("two_factor_token_expiry"),

  // Secret key used by TOTP generators (Google Authenticator, Authy, etc.)
  totpSecret: varchar("totp_secret", { length: 255 }),

  // Toggle indicating whether 2FA is enabled for this user
  isTwoFactorEnabled: boolean("is_two_factor_enabled").notNull().default(false),
})

// Export types
export type UserType = typeof users.$inferSelect
export type NewUser = typeof users.$inferInsert

// Users table

// ForecastExecutions table - NOUVELLE TABLE
export const forecastExecutions = pgTable("forecast_executions", {
  id: serial("id").primaryKey(),
  dateExecution: timestamp("execution_date").notNull().defaultNow(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
})

// ForecastTypes table
export const forecastTypes = pgTable("forecast_types", {
  id: serial("id").primaryKey(),
  name: varchar("name").notNull().unique(),
  description: text("description"),
  isEditable: boolean("is_editable").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  createdBy: integer("created_by"),
  updatedBy: integer("updated_by"),
  color: varchar("color", { length: 10 }),
  lineType: varchar("line_type", { length: 20 }),
})

// ClassificationLevels table
export const classificationLevels = pgTable("classification_levels", {
  id: serial("id").primaryKey(),
  name: varchar("name").notNull(),
  description: text("description"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
})

// Classifications table
export const classifications = pgTable("classifications", {
  id: serial("id").primaryKey(),
  name: varchar("name").notNull().unique(),
  description: text("description"),
  level: integer("level").references(() => classificationLevels.id),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  createdBy: integer("created_by"),
  updatedBy: integer("updated_by"),
  deletedBy: integer("deleted_by"),
  deletedAt: timestamp("deleted_at"),
})

// Products table
export const products = pgTable(
  "products",
  {
    id: serial("id").primaryKey(),
    name: varchar("name").notNull().unique(),
    description: text("description"),
    classificationId: integer("classification_id").references(() => classifications.id),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
    deletedAt: timestamp("deleted_at"),
    createdBy: integer("created_by"),
    updatedBy: integer("updated_by"),
    deletedBy: integer("deleted_by"),
  },
  (table) => {
    return {
      classificationIdIdx: index("idx_products_classification_id").on(table.classificationId),
    }
  },
)

// ForecastData table - MODIFIÉE avec forecast_execution_id
export const forecastData = pgTable(
  "forecast_data",
  {
    id: serial("id").primaryKey(),
    type: varchar("type", { length: 10 }).notNull(),
    forecastTypeId: integer("forecast_type_id")
      .notNull()
      .references(() => forecastTypes.id),
    classificationId: integer("classification_id").references(() => classifications.id),
    productId: integer("product_id").references(() => products.id),
    forecastExecutionId: integer("forecast_execution_id").references(() => forecastExecutions.id), // NOUVEAU CHAMP
    date: date("date").notNull(),
    value: numeric("value").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
    createdBy: integer("created_by"),
    updatedBy: integer("updated_by"),
  },
  (table) => {
    return {
      forecastTypeIdIdx: index("idx_forecast_data_forecast_type_id").on(table.forecastTypeId),
      typeIdx: index("idx_forecast_data_type").on(table.type),
      productDateIdx: index("idx_forecast_data_product_date").on(table.productId, table.date),
      classificationDateIdx: index("idx_forecast_data_classification_date").on(table.classificationId, table.date),
      forecastExecutionIdIdx: index("idx_forecast_data_execution_id").on(table.forecastExecutionId), // NOUVEL INDEX
    }
  },
)

// Relations
export const forecastExecutionsRelations = relations(forecastExecutions, ({ many }) => ({
  forecastData: many(forecastData),
}))

export const productsRelations = relations(products, ({ one }) => ({
  classification: one(classifications, {
    fields: [products.classificationId],
    references: [classifications.id],
  }),
}))

export const forecastDataRelations = relations(forecastData, ({ one }) => ({
  product: one(products, {
    fields: [forecastData.productId],
    references: [products.id],
  }),
  classification: one(classifications, {
    fields: [forecastData.classificationId],
    references: [classifications.id],
  }),
  forecastType: one(forecastTypes, {
    fields: [forecastData.forecastTypeId],
    references: [forecastTypes.id],
  }),
  forecastExecution: one(forecastExecutions, {
    // NOUVELLE RELATION
    fields: [forecastData.forecastExecutionId],
    references: [forecastExecutions.id],
  }),
}))

export const classificationsRelations = relations(classifications, ({ one }) => ({
  level: one(classificationLevels, {
    fields: [classifications.level],
    references: [classificationLevels.id],
  }),
}))
