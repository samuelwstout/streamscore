import { drizzle } from "drizzle-orm/better-sqlite3";
import { migrate } from "drizzle-orm/better-sqlite3/migrator";
import Database from "better-sqlite3";
import { clerkClient } from "@clerk/nextjs/server";
import { z } from "zod";

import { router, publicProcedure } from "./trpc";

import { conversations } from "@/db/schema";

const sqlite = new Database(process.env.TURSO_CONNECTION_URL);
const db = drizzle(sqlite);

migrate(db, { migrationsFolder: "drizzle" });

export const appRouter = router({
  getConversations: publicProcedure.query(async () => {
    const chats = db.select().from(conversations).all();

    const users = await clerkClient.users.getUserList({
      userId: chats.map((chat) => chat.userId!),
    });

    return chats.map((chat) => ({
      chat,
      user: users.find((user) => user.id === chat.userId),
    }));
  }),
  addConversation: publicProcedure
    .input(
      z.object({
        userId: z.string(),
        title: z.string(),
        messages: z.array(z.string()),
      })
    )
    .mutation(async (opts) => {
      await db.insert(conversations).values({
        userId: opts.input.userId,
        title: opts.input.title,
        messages: opts.input.messages,
      });
    }),
});

export type AppRouter = typeof appRouter;
