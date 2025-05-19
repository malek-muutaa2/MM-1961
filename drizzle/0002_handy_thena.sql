ALTER TABLE "users" ADD COLUMN "resetpasswordtoken" varchar;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "passwordresettokenexpiry" timestamp;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "passwordupdatedat" timestamp;--> statement-breakpoint
