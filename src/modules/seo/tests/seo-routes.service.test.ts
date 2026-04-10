import { describe, expect, it, vi } from "vitest";

vi.mock("@/modules/blog/services/blog-storage.service", () => ({
  listBlogPostSlugsFromStorage: vi.fn().mockResolvedValue(["how-much-does-house-painting-cost-in-orlando"])
}));

import { buildSeoRouteEntries } from "@/modules/seo/services/seo-routes.service";

describe("seo-routes.service", () => {
  it("builds localized seo route entries", async () => {
    const entries = await buildSeoRouteEntries();

    expect(entries.length).toBeGreaterThan(0);
    expect(entries.some((entry) => entry.path === "/en/blog")).toBe(true);
    expect(entries.some((entry) => entry.path.includes("/pt/areas/"))).toBe(true);
  });

  it("includes dynamic blog routes", async () => {
    const entries = await buildSeoRouteEntries();
    expect(entries.some((entry) => entry.path.includes("/blog/how-much-does-house-painting-cost-in-orlando"))).toBe(true);
  });
});
