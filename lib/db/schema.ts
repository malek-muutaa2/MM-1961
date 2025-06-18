import {
    pgTable, serial, varchar, timestamp, text, pgEnum, boolean, integer, json, index, numeric,
    date, jsonb, decimal,
} from "drizzle-orm/pg-core"
import { relations } from "drizzle-orm"

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


// Users table

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

// ForecastData table
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
      }
    },
)

// Relations
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
}))

export const classificationsRelations = relations(classifications, ({ one }) => ({
  level: one(classificationLevels, {
    fields: [classifications.level],
    references: [classificationLevels.id],
  }),
}))





// Upload Configurations Table
export const uploadConfigurations = pgTable("upload_configurations", {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 255 }).notNull(),
    description: text("description"),
    organizationType: varchar("organization_type", { length: 100 }),
    // organizationId: integer("organization_id").references(() => organizationTypes.id),
    sourceType: varchar("source_type", { length: 100 }),
    fileType: varchar("file_type", { length: 100 }).notNull(),
    delimiter: varchar("delimiter", { length: 10 }),
    maxFileSize: integer("max_file_size"),
    maxRows: integer("max_rows"),
    storageConfigId: integer("storage_config_id").references(() => uploadStorageConfigurations.id),
    allowPartialUpload: boolean("allow_partial_upload").default(false).notNull(),
    active: boolean("active").default(true).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
    deletedAt: timestamp("deleted_at"),
})

// Upload Configuration Columns Table
export const uploadConfigurationColumns = pgTable("upload_configuration_columns", {
    id: serial("id").primaryKey(),
    configId: integer("config_id").references(() => uploadConfigurations.id),
    name: varchar("name", { length: 255 }).notNull(),
    displayName: varchar("display_name", { length: 255 }).notNull(),
    dataType: varchar("data_type", { length: 50 }).notNull(),
    required: boolean("required").default(false).notNull(),
    pattern: varchar("pattern", { length: 500 }),
    minLength: integer("min_length"),
    maxLength: integer("max_length"),
    minValue: decimal("min_value"),
    maxValue: decimal("max_value"),
    customValidator: text("custom_validator"),
    position: integer("position").notNull(),
})

// Upload Storage Configurations Table
export const uploadStorageConfigurations = pgTable("upload_storage_configurations", {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 255 }).notNull(),
    description: text("description"),
    storageType: varchar("storage_type", { length: 50 }).notNull(),
    bucketName: varchar("bucket_name", { length: 255 }),
    basePath: varchar("base_path", { length: 500 }).notNull(),
    pathTemplate: varchar("path_template", { length: 500 }).notNull(),
    region: varchar("region", { length: 100 }),
    awsAccessKeyId: varchar("aws_access_key_id", { length: 255 }),
    awsSecretAccessKey: varchar("aws_secret_access_key", { length: 255 }),
    accessType: varchar("access_type", { length: 20 }),
    containerName: varchar("container_name", { length: 255 }),
    gcsProjectId: varchar("gcs_project_id", { length: 255 }),
    gcsKeyFilename: varchar("gcs_key_filename", { length: 255 }),
    gcsCredentials: jsonb("gcs_credentials"),
    azureAccountName: varchar("azure_account_name", { length: 255 }),
    azureAccountKey: varchar("azure_account_key", { length: 255 }),
    azureSasToken: varchar("azure_sas_token", { length: 255 }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
    deletedAt: timestamp("deleted_at"),
},
    // index the storage_type column for faster lookups
    (table) => {
        return {
            storageTypeIdx: index("idx_upload_storage_configurations_storage_type").on(table.storageType),
        }
    },
    )

// Upload Operations Table
export const uploadOperations = pgTable("upload_operations", {
    id: serial("id").primaryKey(),
    configId: integer("config_id").references(() => uploadConfigurations.id),
    userId: integer("user_id").references(() => users.id),
    fileName: varchar("file_name", { length: 255 }).notNull(),
    filePath: varchar("file_path", { length: 1000 }).notNull(),
    fileSize: integer("file_size").notNull(),
    rowCount: integer("row_count").notNull(),
    status: varchar("status", { length: 50 }).notNull(),
    errorCount: integer("error_count").default(0).notNull(),
    validationErrors: jsonb("validation_errors"),
    startedAt: timestamp("started_at").defaultNow().notNull(),
    completedAt: timestamp("completed_at"),
    deletedAt: timestamp("deleted_at"),
},
    // Add index on file_path for upload operations file path for faster lookups
    (table) => {
        return {
            filePathIdx: index("idx_upload_operations_file_path").on(table.filePath),
        }
    },
)

// Upload Operation Errors Table
export const uploadOperationErrors = pgTable("upload_operation_errors", {
    id: serial("id").primaryKey(),
    operationId: integer("operation_id").references(() => uploadOperations.id),
    rowNumber: integer("row_number"),
    columnName: varchar("column_name", { length: 255 }),
    errorCode: varchar("error_code", { length: 100 }).notNull(),
    errorMessage: text("error_message").notNull(),
    rawValue: text("raw_value"),
})

// Organization Types Table (for reference data)
export const organizationTypes = pgTable("organization_types", {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 255 }).notNull(),
    sourceTypes: jsonb("source_types").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
    deletedAt: timestamp("deleted_at"),
})

// Relations
export const uploadConfigurationsRelations = relations(uploadConfigurations, ({ many, one }) => ({
    columns: many(uploadConfigurationColumns),
    storageConfig: one(uploadStorageConfigurations, {
        fields: [uploadConfigurations.storageConfigId],
        references: [uploadStorageConfigurations.id],
    }),
    operations: many(uploadOperations),
}))

export const uploadConfigurationColumnsRelations = relations(uploadConfigurationColumns, ({ one }) => ({
    config: one(uploadConfigurations, {
        fields: [uploadConfigurationColumns.configId],
        references: [uploadConfigurations.id],
    }),
}))

export const uploadStorageConfigurationsRelations = relations(uploadStorageConfigurations, ({ many }) => ({
    configurations: many(uploadConfigurations),
}))

export const uploadOperationsRelations = relations(uploadOperations, ({ one, many }) => ({
    config: one(uploadConfigurations, {
        fields: [uploadOperations.configId],
        references: [uploadConfigurations.id],
    }),
    errors: many(uploadOperationErrors),
}))

export const uploadOperationErrorsRelations = relations(uploadOperationErrors, ({ one }) => ({
    operation: one(uploadOperations, {
        fields: [uploadOperationErrors.operationId],
        references: [uploadOperations.id],
    }),
}))
