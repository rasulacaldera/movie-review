import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  PORT: z.coerce.number().default(3001),
  HOST: z.string().default("0.0.0.0"),
  LOG_LEVEL: z
    .enum(["fatal", "error", "warn", "info", "debug", "trace"])
    .default("info"),
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  TMDB_READ_ACCESS_TOKEN: z
    .string()
    .min(1, "TMDB_READ_ACCESS_TOKEN is required"),
  TMDB_BASE_URL: z.string().url().default("https://api.themoviedb.org/3"),
});

export const config = envSchema.parse(process.env);
export type Config = z.infer<typeof envSchema>;
