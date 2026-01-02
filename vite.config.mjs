/* eslint-env node */
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";
import { fileURLToPath } from "url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));

export default defineConfig({
  base: "/company/",
  optimizeDeps: {
    // Force pre-bundling of @mui/icons-material to reduce file handles
    include: ["@mui/icons-material"],
    // Force optimization to prevent individual file opens
    force: true,
  },
  define: {
    global: "globalThis",
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        silenceDeprecations: ["legacy-js-api"],
      },
    },
  },
  plugins: [react()],
  server: {
    port: 8914,
    watch: {
      // Prevent excessive file watching on Windows
      ignored: [
        "**/node_modules/**",
        "**/dist/**",
        "**/.git/**",
        "**/.svn/**",
        "**/coverage/**",
      ],
      // Use polling on Windows for better file handle management
      usePolling: false,
      interval: 1000,
    },
    // Reduce file system operations
    fs: {
      strict: false,
      allow: [".."],
    },
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/test/setup.js",
    css: true,
    // Use forks pool instead of threads for better Windows file handle management
    pool: "forks",
    poolOptions: {
      forks: {
        singleFork: true,
        isolate: false,
      },
    },
    // Inline dependencies to reduce file operations - process @mui/icons-material in main process
    deps: {
      inline: ["@mui/icons-material", "@mui/material"],
      external: ["@mui/icons-material"],
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
      "**/node_modules/@mui/icons-material/**",
    ],
    // Reduce file system operations during tests
    isolate: false,
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
