import { pgTable, text } from "drizzle-orm/pg-core";

export const proxiesTable = pgTable("proxies", {
  address: text().notNull().unique(),
  target: text().notNull(),
});
