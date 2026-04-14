import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  test: {
    include: ["src/**/*.int.test.ts"],
    globals: true,
    passWithNoTests: true,
    testTimeout: 15000,
    hookTimeout: 15000,
    env: {
      DATABASE_URL: "postgres://test:test@localhost:5432/test",
      TMDB_READ_ACCESS_TOKEN: "test-token",
      TMDB_BASE_URL: "https://test-tmdb.example.com/3",
      NODE_ENV: "test",
    },
  },
  resolve: {
    alias: {
      "~": path.resolve(__dirname, "src"),
    },
  },
});
