import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "node:path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src")
    }
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./vitest.setup.ts"],
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
      reportsDirectory: "coverage",
      include: [
        "src/app/api/admin/pixels/route.ts",
        "src/modules/analytics/dtos/track-event.dto.ts",
        "src/modules/areas/data/service-areas.data.ts",
        "src/modules/blog/data/blog-posts.data.ts",
        "src/modules/blog/dtos/manage-blog-post.dto.ts",
        "src/modules/leads/dtos/create-lead-note.dto.ts",
        "src/modules/leads/dtos/create-lead.dto.ts",
        "src/modules/leads/dtos/lead-follow-up.dto.ts",
        "src/modules/leads/dtos/list-leads-query.dto.ts",
        "src/modules/pixels/dtos/pixel-settings.dto.ts"
      ],
      exclude: [
        "src/**/*.test.{ts,tsx}",
        "src/app/**/page.tsx",
        "src/app/layout.tsx",
        "src/app/[locale]/layout.tsx"
      ],
      thresholds: {
        statements: 100,
        branches: 100,
        functions: 100,
        lines: 100
      }
    }
  }
});
