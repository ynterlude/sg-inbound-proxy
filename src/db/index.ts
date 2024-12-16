import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

// TODO: Environment variable validation
export const db = drizzle({
  connection: process.env.DATABASE_URL!,
  casing: "snake_case",
  schema,
});
