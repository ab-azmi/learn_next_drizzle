import * as dotenv from "dotenv";
import { defineConfig } from "drizzle-kit";

dotenv.config({
    path: ".env.local"
})


export default defineConfig({
  schema: "./server/schema.ts",
  out: "./server/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.POSTGRESS_URL!,
    database: process.env.PGDATABASE!,
    host: process.env.PGHOST!,
    user: process.env.PGUSER!,
    password: process.env.PGPASSWORD!
  },
});
