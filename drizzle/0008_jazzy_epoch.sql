-- ALTER TABLE "upload_configurations" DROP CONSTRAINT "upload_configurations_organization_id_organization_types_id_fk";
--> statement-breakpoint
ALTER TABLE "upload_configurations" ALTER COLUMN "organization_type" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "upload_configurations" ALTER COLUMN "source_type" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "upload_configurations" ALTER COLUMN "delimiter" DROP NOT NULL;--> statement-breakpoint
-- ALTER TABLE "upload_configurations" ADD COLUMN "allow_partial_upload" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "upload_configurations" DROP COLUMN "organization_id";
