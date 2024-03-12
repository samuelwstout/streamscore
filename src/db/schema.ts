import {
  integer,
  sqliteTable,
  text,
  blob,
  index,
} from "drizzle-orm/sqlite-core";
import type { Message } from "ai";

export const conversations = sqliteTable(
  "conversations",
  {
    id: integer("id").primaryKey(),
    userId: text("userId"),
    title: text("title"),
    messages: blob("messages", { mode: "json" }).$type<Message[]>(),
  },
  (table) => {
    return {
      userIdIndex: index("userId_index").on(table.userId),
    };
  }
);

export type InsertConversation = typeof conversations.$inferInsert;
export type SelectConversation = typeof conversations.$inferSelect;
