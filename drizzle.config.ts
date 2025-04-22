import { defineConfig } from "drizzle-kit";
import { config } from 'dotenv';

// Load environment variables
config();

const databaseUrl = process.env.LOCAL_DATABASE_URL || process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("No database URL provided. Please set either LOCAL_DATABASE_URL or DATABASE_URL environment variable.");
}

export default defineConfig({
  out: "./migrations",
  schema: "./shared/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: databaseUrl,
  },
});
