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
  // get all conversations for current user
  // create conversation
});

export type AppRouter = typeof appRouter;
