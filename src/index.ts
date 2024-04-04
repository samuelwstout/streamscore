import { resolve } from "path";
import { db } from "./db/db";
import { migrate } from "drizzle-orm/libsql/migrator";

(async () => {
  await migrate(db, {
    migrationsFolder: resolve(__dirname, "../../migrations"),
  });
})();
