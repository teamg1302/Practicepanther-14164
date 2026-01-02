/* eslint-env node */
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";
import { fileURLToPath } from "url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));

export default defineConfig({
  base: "/company/",
  define: {
    global: "globalThis",
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },
  plugins: [react()],
  server: {
    port: 8914,
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/test/setup.js",
    deps: {
      external: ["@mui/icons-material"],
    },
    css: true,
    // Use threads pool with single thread to reduce file handles
    pool: "threads",
    poolOptions: {
      threads: {
        singleThread: true,
        maxThreads: 1,
      },
    },
    // Limit concurrent test execution
    maxConcurrency: 1,
    // Limit test file discovery
    include: ["src/**/*.{test,spec}.{js,jsx,ts,tsx}"],
    // Exclude unnecessary files from test processing
    exclude: [
      "**/node_modules/**",
      "**/dist/**",
      "**/.git/**",
      "**/.svn/**",
      "**/coverage/**",
      "**/public/**",
      "**/src/style/**",
      "**/src/core/json/**",
      "**/src/core/modals/**",
      "**/src/feature-module/pages/**",
    ],
    // Reduce file watching
    watchExclude: [
      "**/node_modules/**",
      "**/dist/**",
      "**/.git/**",
      "**/.svn/**",
      "**/coverage/**",
      "**/public/**",
    ],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      exclude: [
        "node_modules/",
        "src/test/",
        "**/*.config.js",
        "**/*.config.ts",
        "**/public/**",
        "**/src/style/**",
        "**/src/core/json/**",
      ],
    },
  },
});
