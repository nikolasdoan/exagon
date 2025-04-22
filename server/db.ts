import { config } from 'dotenv';
import pkg from 'pg';
const { Pool } = pkg;
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from "@shared/schema";

// Load environment variables from .env file
config();

// Use local database URL if provided, otherwise fall back to remote database
const databaseUrl = process.env.LOCAL_DATABASE_URL || process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error(
    "No database URL provided. Please set either LOCAL_DATABASE_URL or DATABASE_URL environment variable.",
  );
}

export const pool = new Pool({ connectionString: databaseUrl });
export const db = drizzle(pool, { schema });