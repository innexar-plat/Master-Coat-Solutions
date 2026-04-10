import { beforeEach, describe, expect, it, vi } from "vitest";
import { ZodError } from "zod";

vi.mock("@/modules/leads/services/lead-storage.service", () => ({
  saveLeadRecord: vi.fn()
}));

vi.mock("@/modules/leads/services/lead-notification.service", () => ({
  notifyNewLead: vi.fn()
}));

vi.mock("@/modules/leads/services/lead-capture.service", () => ({
  captureLead: vi.fn()
}));

import { captureLead } from "@/modules/leads/services/lead-capture.service";
import { POST } from "./route";

describe("POST /api/leads", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 201 on success", async () => {
    vi.mocked(captureLead).mockResolvedValue({
      id: "lead-1",
      name: "John",
      phone: "407",
      service: "Interior",
      locale: "en",
      source: "free-estimate",
      status: "NEW",
      createdAt: new Date().toISOString()
    });

    const response = await POST(new Request("http://localhost/api/leads", { method: "POST", body: "{}" }));
    expect(response.status).toBe(201);
  });

  it("returns 400 on validation error", async () => {
    vi.mocked(captureLead).mockRejectedValue(new ZodError([]));

    const response = await POST(new Request("http://localhost/api/leads", { method: "POST", body: "{}" }));
    expect(response.status).toBe(400);
  });

  it("returns 500 on unexpected error", async () => {
    vi.mocked(captureLead).mockRejectedValue(new Error("boom"));

    const response = await POST(new Request("http://localhost/api/leads", { method: "POST", body: "{}" }));
    expect(response.status).toBe(500);
  });
});
