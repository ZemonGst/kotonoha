import {
  pgTable,
  uuid,
  varchar,
  timestamp,
  text,
  boolean,
  numeric,
  pgEnum,
  unique,
  jsonb,
} from "drizzle-orm/pg-core";

import { formsTable } from "./form";

export const formFieldType = pgEnum("field_type", [
  "text",
  "number",
  "email",
  "phone",
  "textarea",
  "select",
  "yes_no",
  "password",
  "checkbox",
  "radio",
  "date",
  "time",
  "datetime",
]);

export const formFieldsTable = pgTable(
  "form_fields",
  {
    id: uuid("id").primaryKey().defaultRandom(),

    formId: uuid("form_id")
      .notNull()
      .references(() => formsTable.id, {
        onDelete: "cascade",
      }),

    type: formFieldType("type").notNull(),

    label: varchar("label", { length: 100 }).notNull(),
    labelKey: varchar("label_key", { length: 100 }).notNull(),

    description: text("description"),

    placeholder: text("placeholder"),

    isRequired: boolean("is_required")
      .default(false)
      .notNull(),

    // fractional ordering
    order: numeric("order", {
      precision: 20,
      scale: 10,
    }).notNull(),

    // future-proof configuration
    config: jsonb("config")
      .$type<Record<string, unknown>>()
      .notNull()
      .default({}),

    createdAt: timestamp("created_at")
      .defaultNow()
      .notNull(),

    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => ({
    uniqueFormIdAndOrder: unique().on(
      table.formId,
      table.order
    ),
  })
);