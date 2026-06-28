import {
    pgTable,
    uuid,
    varchar,
    timestamp,
    integer,
    unique,
} from "drizzle-orm/pg-core";

import { usersTable } from "./user";

export const userOtpsTable = pgTable(
    "email_verification_otps",
    {
        id: uuid("id").primaryKey().defaultRandom(),

        userId: uuid("user_id")
            .notNull()
            .references(() => usersTable.id, {
                onDelete: "cascade",
            }),

        purpose: varchar("purpose", { length: 50 }).notNull().default("EMAIL_VERIFICATION"),

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
    },
    (t) => ({
        unq: unique("user_id_purpose_unq").on(t.userId, t.purpose),
    })
);

export type SelectUserOtp =
    typeof userOtpsTable.$inferSelect;

export type InsertUserOtp =
    typeof userOtpsTable.$inferInsert;