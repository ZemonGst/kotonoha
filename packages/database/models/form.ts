import {
  pgTable,
  uuid,
  varchar,
  timestamp,
  pgEnum,
} from "drizzle-orm/pg-core";
import { usersTable } from "./user";

export const formStatusEnum = pgEnum("form_status", ["draft", "active", "archived"]);

export const formsTable = pgTable("forms", {
  id: uuid("id").primaryKey().defaultRandom(),

  title: varchar("title", { length: 100 }).notNull(),
  description: varchar("description", { length: 500 }),

  createdBy: uuid("created_by")
    .notNull()
    .references(() => usersTable.id),

  status: formStatusEnum("status").default("draft").notNull(),

  createdAt: timestamp("created_at").defaultNow().notNull(),

  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),

});