import { describe, expect, it } from "vitest";
import { listLeadsQuerySchema } from "@/modules/leads/dtos/list-leads-query.dto";

describe("listLeadsQuerySchema", () => {
  it("applies defaults and accepts filters", () => {
    const parsed = listLeadsQuerySchema.parse({
      status: "NEW",
      search: "john"
    });

    expect(parsed.page).toBe(1);
    expect(parsed.limit).toBe(20);
    expect(parsed.status).toBe("NEW");
    expect(parsed.search).toBe("john");
  });

  it("rejects invalid limit", () => {
    expect(() => listLeadsQuerySchema.parse({ limit: 999 })).toThrow();
  });
});
