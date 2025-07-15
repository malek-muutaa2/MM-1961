-- ALTER TABLE "organization_types" ALTER COLUMN "id" SET DATA TYPE serial;--> statement-breakpoint
ALTER TABLE "organization_types" ADD COLUMN "updated_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "organization_types" ADD COLUMN "deleted_at" timestamp;--> statement-breakpoint
ALTER TABLE "upload_configurations" ADD COLUMN "deleted_at" timestamp;--> statement-breakpoint
ALTER TABLE "upload_operations" ADD COLUMN "deleted_at" timestamp;--> statement-breakpoint
ALTER TABLE "upload_storage_configurations" ADD COLUMN "container_name" varchar(255);--> statement-breakpoint
ALTER TABLE "upload_storage_configurations" ADD COLUMN "gcs_project_id" varchar(255);--> statement-breakpoint
ALTER TABLE "upload_storage_configurations" ADD COLUMN "gcs_key_filename" varchar(255);--> statement-breakpoint
ALTER TABLE "upload_storage_configurations" ADD COLUMN "gcs_credentials" jsonb;--> statement-breakpoint
ALTER TABLE "upload_storage_configurations" ADD COLUMN "azure_account_name" varchar(255);--> statement-breakpoint
ALTER TABLE "upload_storage_configurations" ADD COLUMN "azure_account_key" varchar(255);--> statement-breakpoint
ALTER TABLE "upload_storage_configurations" ADD COLUMN "azure_sas_token" varchar(255);--> statement-breakpoint
ALTER TABLE "upload_storage_configurations" ADD COLUMN "deleted_at" timestamp;--> statement-breakpoint
CREATE INDEX "idx_upload_operations_file_path" ON "upload_operations" USING btree ("file_path");--> statement-breakpoint
CREATE INDEX "idx_upload_storage_configurations_storage_type" ON "upload_storage_configurations" USING btree ("storage_type");
