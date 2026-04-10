import { describe, expect, it } from "vitest";
import { fromPrismaSource, toPrismaSource } from "@/modules/leads/services/lead-prisma-storage.service";

describe("lead-prisma-storage source mapping", () => {
  it("maps domain source to prisma source", () => {
    expect(toPrismaSource("free-estimate")).toBe("free_estimate");
    expect(toPrismaSource("landing-page")).toBe("landing_page");
    expect(toPrismaSource("contact")).toBe("contact");
  });

  it("maps prisma source to domain source", () => {
    expect(fromPrismaSource("free_estimate")).toBe("free-estimate");
    expect(fromPrismaSource("landing_page")).toBe("landing-page");
    expect(fromPrismaSource("contact")).toBe("contact");
  });
});
