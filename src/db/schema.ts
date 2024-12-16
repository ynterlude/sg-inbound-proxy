import { pgTable, text, timestamp, integer } from "drizzle-orm/pg-core";

export const proxiesTable = pgTable("proxies", {
  code: text().notNull().unique(),
  generatedAt: timestamp().defaultNow().notNull(),
  checkCount: integer().default(0).notNull(),
});
