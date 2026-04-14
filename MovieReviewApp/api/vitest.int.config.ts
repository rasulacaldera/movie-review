import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  test: {
    include: ["src/**/*.int.test.ts"],
    globals: true,
    passWithNoTests: true,
    testTimeout: 15000,
    hookTimeout: 15000,
  },
  resolve: {
    alias: {
      "~": path.resolve(__dirname, "src"),
    },
  },
});
