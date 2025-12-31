/* eslint-env node */
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";
import { fileURLToPath } from "url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));

export default defineConfig({
  base: "/company/",
  optimizeDeps: {
    exclude: ["@mui/icons-material"],
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
      ignored: ["**/node_modules/**"],
    },
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/test/setup.js",
    css: true,
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      exclude: [
        "node_modules/",
        "src/test/",
        "**/*.config.js",
        "**/*.config.ts",
      ],
    },
  },
});
