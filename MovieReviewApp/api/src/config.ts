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
});

export const config = envSchema.parse(process.env);
export type Config = z.infer<typeof envSchema>;
