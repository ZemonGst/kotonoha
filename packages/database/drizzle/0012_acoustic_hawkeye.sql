ALTER TABLE "email_verification_otps" DROP CONSTRAINT "email_verification_otps_user_id_unique";--> statement-breakpoint
ALTER TABLE "email_verification_otps" ADD COLUMN "purpose" varchar(50) DEFAULT 'EMAIL_VERIFICATION' NOT NULL;--> statement-breakpoint
ALTER TABLE "email_verification_otps" ADD CONSTRAINT "user_id_purpose_unq" UNIQUE("user_id","purpose");