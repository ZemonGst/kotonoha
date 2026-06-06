import {
  pgTable,
  uuid,
  timestamp,
  jsonb,
} from "drizzle-orm/pg-core";

import { publishedFormsTable } from "./published-form";

export const responsesTable = pgTable("responses", {
  id: uuid("id").primaryKey().defaultRandom(),

  publishedFormId: uuid("published_form_id")
    .notNull()
    .references(() => publishedFormsTable.id, { onDelete: "cascade" }),

  answers: jsonb("answers")
    .$type<Record<string, unknown>>()
    .notNull()
    .default({}),

  submittedAt: timestamp("submitted_at").defaultNow().notNull(),
});
