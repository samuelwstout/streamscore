import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const todos = sqliteTable("todos", {
  id: integer("id").primaryKey(),
  content: text("content"),
  done: integer("done"),
});

export const conversations = sqliteTable("conversations", {
  id: integer("id").primaryKey(),
  name: text("name"),
  messages: text("messages", { mode: "json" }),
});
