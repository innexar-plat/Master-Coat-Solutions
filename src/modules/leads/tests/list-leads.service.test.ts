import { describe, expect, it } from "vitest";
import type { LeadRecord } from "@/modules/leads/dtos/create-lead.dto";
import { filterLeadRecords } from "@/modules/leads/services/list-leads.service";

const LEADS: LeadRecord[] = [
  {
    id: "1",
    name: "John Orlando",
    phone: "4071111111",
    email: "john@example.com",
    service: "Interior",
    message: "urgent",
    locale: "en",
    source: "free-estimate",
    status: "NEW",
    createdAt: "2026-04-02T10:00:00.000Z"
  },
  {
    id: "2",
    name: "Maria Silva",
    phone: "4072222222",
    email: "maria@example.com",
    service: "Exterior",
    message: "",
    locale: "pt",
    source: "contact",
    status: "CONTACTED",
    createdAt: "2026-04-03T10:00:00.000Z"
  }
];

describe("filterLeadRecords", () => {
  it("filters by status and search", () => {
    const filtered = filterLeadRecords(LEADS, {
      page: 1,
      limit: 20,
      status: "NEW",
      search: "john",
      order: "desc"
    });

    expect(filtered).toHaveLength(1);
    expect(filtered[0]?.id).toBe("1");
  });

  it("sorts by created date asc", () => {
    const filtered = filterLeadRecords(LEADS, {
      page: 1,
      limit: 20,
      order: "asc"
    });

    expect(filtered[0]?.id).toBe("1");
    expect(filtered[1]?.id).toBe("2");
  });
});
