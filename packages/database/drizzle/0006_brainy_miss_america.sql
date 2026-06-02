CREATE TYPE "public"."form_status" AS ENUM('draft', 'active', 'archived');--> statement-breakpoint
ALTER TABLE "forms" ADD COLUMN "status" "form_status" DEFAULT 'draft' NOT NULL;