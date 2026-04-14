import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  test: {
    include: ["src/**/*.unit.test.ts"],
    globals: true,
    passWithNoTests: true,
  },
  resolve: {
    alias: {
      "~": path.resolve(__dirname, "src"),
    },
  },
});
