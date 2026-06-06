import {
  pgTable,
  uuid,
  timestamp,
} from "drizzle-orm/pg-core";

import { formsTable } from "./form";
import { usersTable } from "./user";

export const publishedFormsTable = pgTable("published_forms", {
  id: uuid("id").primaryKey().defaultRandom(),

  formId: uuid("form_id")
    .notNull()
    .references(() => formsTable.id, { onDelete: "cascade" }),

  publishedBy: uuid("published_by")
    .notNull()
    .references(() => usersTable.id),

  publishedAt: timestamp("published_at").defaultNow().notNull(),

  expiresAt: timestamp("expires_at"),

  createdAt: timestamp("created_at").defaultNow().notNull(),

  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});
