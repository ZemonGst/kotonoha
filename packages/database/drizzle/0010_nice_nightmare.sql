ALTER TABLE "responses" ADD COLUMN "response_data" jsonb DEFAULT '{}'::jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "responses" ADD COLUMN "created_at" timestamp DEFAULT now() NOT NULL;