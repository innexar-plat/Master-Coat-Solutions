import { describe, expect, it } from "vitest";
import { createLeadSchema } from "@/modules/leads/dtos/create-lead.dto";

describe("createLeadSchema", () => {
  it("accepts valid payload", () => {
    const parsed = createLeadSchema.parse({
      name: "John Doe",
      phone: "4075551200",
      email: "john@example.com",
      service: "Interior Painting",
      message: "Need full repaint",
      locale: "en",
      source: "free-estimate"
    });

    expect(parsed.name).toBe("John Doe");
  });

  it("rejects invalid payload", () => {
    expect(() =>
      createLeadSchema.parse({
        name: "A",
        phone: "1",
        service: ""
      })
    ).toThrowError();
  });
});
