import {
    pgTable,
    uuid,
    varchar,
    timestamp,
    integer,
} from "drizzle-orm/pg-core";

import { usersTable } from "./user";

export const emailVerificationOtpsTable = pgTable(
    "email_verification_otps",
    {
        id: uuid("id").primaryKey().defaultRandom(),

        userId: uuid("user_id")
            .notNull()
            .unique()
            .references(() => usersTable.id, {
                onDelete: "cascade",
            }),

        otpHash: varchar("otp_hash", { length: 255 }).notNull(),

        attempts: integer("attempts")
            .notNull()
            .default(0),

        expiresAt: timestamp("expires_at", {
            mode: "date",
        }).notNull(),

        createdAt: timestamp("created_at", {
            mode: "date",
        })
            .notNull()
            .defaultNow(),
    }
);

export type SelectEmailVerificationOtp =
    typeof emailVerificationOtpsTable.$inferSelect;

export type InsertEmailVerificationOtp =
    typeof emailVerificationOtpsTable.$inferInsert;