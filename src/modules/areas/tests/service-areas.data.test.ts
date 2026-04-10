import { describe, expect, it } from "vitest";
import { findServiceAreaBySlug, listServiceAreaSlugs, listServiceAreas } from "@/modules/areas/data/service-areas.data";

describe("service-areas.data", () => {
  it("lists localized areas", () => {
    const areas = listServiceAreas("en");
    expect(areas.length).toBeGreaterThan(0);
    expect(areas[0]?.city).toBeTypeOf("string");
  });

  it("finds area by slug", () => {
    const area = findServiceAreaBySlug("orlando", "pt");
    expect(area?.city).toBe("Orlando");
  });

  it("returns null for missing slug", () => {
    const area = findServiceAreaBySlug("missing", "en");
    expect(area).toBeNull();
  });

  it("lists all service area slugs", () => {
    const slugs = listServiceAreaSlugs();
    expect(slugs).toContain("orlando");
  });
});
