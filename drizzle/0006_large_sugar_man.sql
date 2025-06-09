-- CREATE TABLE "classification_levels" (
-- 	"id" serial PRIMARY KEY NOT NULL,
-- 	"name" varchar NOT NULL,
-- 	"description" text,
-- 	"created_at" timestamp DEFAULT now() NOT NULL,
-- 	"updated_at" timestamp DEFAULT now() NOT NULL
-- );
--> statement-breakpoint
-- CREATE TABLE "classifications" (
-- 	"id" serial PRIMARY KEY NOT NULL,
-- 	"name" varchar NOT NULL,
-- 	"description" text,
-- 	"level" integer,
-- 	"created_at" timestamp DEFAULT now() NOT NULL,
-- 	"updated_at" timestamp DEFAULT now() NOT NULL,
-- 	"created_by" integer,
-- 	"updated_by" integer,
-- 	"deleted_by" integer,
-- 	"deleted_at" timestamp,
-- 	CONSTRAINT "classifications_name_unique" UNIQUE("name")
-- );
-- --> statement-breakpoint
-- CREATE TABLE "forecast_data" (
-- 	"id" serial PRIMARY KEY NOT NULL,
-- 	"type" varchar(10) NOT NULL,
-- 	"forecast_type_id" integer NOT NULL,
-- 	"classification_id" integer,
-- 	"product_id" integer,
-- 	"date" date NOT NULL,
-- 	"value" numeric NOT NULL,
-- 	"created_at" timestamp DEFAULT now() NOT NULL,
-- 	"updated_at" timestamp DEFAULT now() NOT NULL,
-- 	"created_by" integer,
-- 	"updated_by" integer
-- );
-- --> statement-breakpoint
-- CREATE TABLE "forecast_types" (
-- 	"id" serial PRIMARY KEY NOT NULL,
-- 	"name" varchar NOT NULL,
-- 	"description" text,
-- 	"is_editable" boolean DEFAULT true NOT NULL,
-- 	"created_at" timestamp DEFAULT now() NOT NULL,
-- 	"updated_at" timestamp DEFAULT now() NOT NULL,
-- 	"created_by" integer,
-- 	"updated_by" integer,
-- 	"color" varchar(10),
-- 	"line_type" varchar(20),
-- 	CONSTRAINT "forecast_types_name_unique" UNIQUE("name")
-- );
--> statement-breakpoint
CREATE TABLE "organization_types" (
    "id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"source_types" jsonb NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
-- CREATE TABLE "products" (
-- 	"id" serial PRIMARY KEY NOT NULL,
-- 	"name" varchar NOT NULL,
-- 	"description" text,
-- 	"classification_id" integer,
-- 	"created_at" timestamp DEFAULT now() NOT NULL,
-- 	"updated_at" timestamp DEFAULT now() NOT NULL,
-- 	"deleted_at" timestamp,
-- 	"created_by" integer,
-- 	"updated_by" integer,
-- 	"deleted_by" integer,
-- 	CONSTRAINT "products_name_unique" UNIQUE("name")
-- );
--> statement-breakpoint
CREATE TABLE "upload_configuration_columns" (
	"id" serial PRIMARY KEY NOT NULL,
	"config_id" integer,
	"name" varchar(255) NOT NULL,
	"display_name" varchar(255) NOT NULL,
	"data_type" varchar(50) NOT NULL,
	"required" boolean DEFAULT false NOT NULL,
	"pattern" varchar(500),
	"min_length" integer,
	"max_length" integer,
	"min_value" numeric,
	"max_value" numeric,
	"custom_validator" text,
	"position" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "upload_configurations" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text,
	"organization_type" varchar(100) NOT NULL,
	"organization_id" integer,
	"source_type" varchar(100) NOT NULL,
	"file_type" varchar(100) NOT NULL,
	"delimiter" varchar(10) NOT NULL,
	"max_file_size" integer NOT NULL,
	"max_rows" integer,
	"storage_config_id" integer,
	"active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "upload_operation_errors" (
	"id" serial PRIMARY KEY NOT NULL,
	"operation_id" integer,
	"row_number" integer,
	"column_name" varchar(255),
	"error_code" varchar(100) NOT NULL,
	"error_message" text NOT NULL,
	"raw_value" text
);
--> statement-breakpoint
CREATE TABLE "upload_operations" (
	"id" serial PRIMARY KEY NOT NULL,
	"config_id" integer,
	"user_id" integer,
	"file_name" varchar(255) NOT NULL,
	"file_path" varchar(1000) NOT NULL,
	"file_size" integer NOT NULL,
	"row_count" integer NOT NULL,
	"status" varchar(50) NOT NULL,
	"error_count" integer DEFAULT 0 NOT NULL,
	"validation_errors" jsonb,
	"started_at" timestamp DEFAULT now() NOT NULL,
	"completed_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "upload_storage_configurations" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text,
	"storage_type" varchar(50) NOT NULL,
	"bucket_name" varchar(255),
	"base_path" varchar(500) NOT NULL,
	"path_template" varchar(500) NOT NULL,
	"region" varchar(100),
	"aws_access_key_id" varchar(255),
	"aws_secret_access_key" varchar(255),
	"access_type" varchar(20),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
-- ALTER TABLE "classifications" ADD CONSTRAINT "classifications_level_classification_levels_id_fk" FOREIGN KEY ("level") REFERENCES "public"."classification_levels"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
-- ALTER TABLE "forecast_data" ADD CONSTRAINT "forecast_data_forecast_type_id_forecast_types_id_fk" FOREIGN KEY ("forecast_type_id") REFERENCES "public"."forecast_types"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
-- ALTER TABLE "forecast_data" ADD CONSTRAINT "forecast_data_classification_id_classifications_id_fk" FOREIGN KEY ("classification_id") REFERENCES "public"."classifications"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
-- ALTER TABLE "forecast_data" ADD CONSTRAINT "forecast_data_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
-- ALTER TABLE "products" ADD CONSTRAINT "products_classification_id_classifications_id_fk" FOREIGN KEY ("classification_id") REFERENCES "public"."classifications"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "upload_configuration_columns" ADD CONSTRAINT "upload_configuration_columns_config_id_upload_configurations_id_fk" FOREIGN KEY ("config_id") REFERENCES "public"."upload_configurations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "upload_configurations" ADD CONSTRAINT "upload_configurations_organization_id_organization_types_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organization_types"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "upload_configurations" ADD CONSTRAINT "upload_configurations_storage_config_id_upload_storage_configurations_id_fk" FOREIGN KEY ("storage_config_id") REFERENCES "public"."upload_storage_configurations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "upload_operation_errors" ADD CONSTRAINT "upload_operation_errors_operation_id_upload_operations_id_fk" FOREIGN KEY ("operation_id") REFERENCES "public"."upload_operations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "upload_operations" ADD CONSTRAINT "upload_operations_config_id_upload_configurations_id_fk" FOREIGN KEY ("config_id") REFERENCES "public"."upload_configurations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "upload_operations" ADD CONSTRAINT "upload_operations_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
-- CREATE INDEX "idx_forecast_data_forecast_type_id" ON "forecast_data" USING btree ("forecast_type_id");--> statement-breakpoint
-- CREATE INDEX "idx_forecast_data_type" ON "forecast_data" USING btree ("type");--> statement-breakpoint
-- CREATE INDEX "idx_forecast_data_product_date" ON "forecast_data" USING btree ("product_id","date");--> statement-breakpoint
-- CREATE INDEX "idx_forecast_data_classification_date" ON "forecast_data" USING btree ("classification_id","date");--> statement-breakpoint
-- CREATE INDEX "idx_products_classification_id" ON "products" USING btree ("classification_id");
