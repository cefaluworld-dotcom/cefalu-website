import { defineConfig } from "vitest/config";
import path from "node:path";

export default defineConfig({
  test: {
    environment: "node",
    include: ["tests/**/*.test.ts"],
    coverage: {
      provider: "v8",
      reporter: ["text", "html", "lcov"],
      include: ["lib/**/*.ts", "services/**/*.ts", "utils/**/*.ts"],
      exclude: ["**/*.d.ts", "tests/**", "**/node_modules/**"],
    },
  },
  resolve: {
    alias: [
      { find: "server-only", replacement: path.resolve(__dirname, "tests/stubs/server-only.ts") },
      { find: /^@\/(.*)$/, replacement: path.resolve(__dirname, "$1") },
    ],
  },
});
