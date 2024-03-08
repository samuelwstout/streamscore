import {
  integer,
  sqliteTable,
  text,
  blob,
  index,
} from "drizzle-orm/sqlite-core";

export const conversations = sqliteTable(
  "conversations",
  {
    id: integer("id").primaryKey(),
    userId: integer("userId"),
    title: text("title"),
    messages: blob("messages", { mode: "json" }).$type<string[]>(),
  },
  (table) => {
    return {
      userIdIndex: index("userId_index").on(table.userId),
    };
  }
);
