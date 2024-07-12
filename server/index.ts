import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from '@/server/schema';
import * as dotenv from "dotenv";

dotenv.config({
    path: `.env.local`
})

const sql = neon(`postgresql://${process.env.PGUSER}:${process.env.PGPASSWORD}@${process.env.PGHOST}/${process.env.PGDATABASE}?sslmode=require`);

export const db = drizzle(sql, {
    schema, logger: true
});