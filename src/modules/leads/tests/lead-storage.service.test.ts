import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/modules/leads/services/lead-prisma-storage.service", () => ({
  readLeadRecordsFromPrisma: vi.fn(),
  saveLeadRecordInPrisma: vi.fn(),
  updateLeadStatusByIdInPrisma: vi.fn(),
}));

const ORIGINAL_ENV = process.env;

describe("lead-storage.service", () => {
  beforeEach(() => {
    vi.resetModules();
    process.env = { ...ORIGINAL_ENV };
  });

  afterEach(() => {
    process.env = { ...ORIGINAL_ENV };
    vi.clearAllMocks();
  });

  it("throws on prisma write failure in production when fallback is disabled", async () => {
    process.env = {
      ...ORIGINAL_ENV,
      NODE_ENV: "production",
      DATABASE_URL: "postgresql://user:pass@localhost:5432/db",
      ALLOW_FILE_LEAD_STORAGE_FALLBACK: "false",
    };

    const prismaStorage =
      await import("@/modules/leads/services/lead-prisma-storage.service");
    vi.mocked(prismaStorage.saveLeadRecordInPrisma).mockRejectedValue(
      new Error("db down"),
    );

    const { saveLeadRecord } =
      await import("@/modules/leads/services/lead-storage.service");

    await expect(
      saveLeadRecord({
        id: "lead-1",
        name: "John Doe",
        phone: "4075551234",
        service: "Interior",
        locale: "en",
        source: "contact",
        status: "NEW",
        createdAt: new Date().toISOString(),
      }),
    ).rejects.toThrowError("Lead persistence failed using Prisma");
  });

  it("falls back to file storage in development on prisma read failure", async () => {
    process.env = {
      ...ORIGINAL_ENV,
      NODE_ENV: "development",
      DATABASE_URL: "postgresql://user:pass@localhost:5432/db",
    };

    const prismaStorage =
      await import("@/modules/leads/services/lead-prisma-storage.service");
    vi.mocked(prismaStorage.readLeadRecordsFromPrisma).mockRejectedValue(
      new Error("db down"),
    );

    const { readLeadRecords } =
      await import("@/modules/leads/services/lead-storage.service");
    const records = await readLeadRecords();

    expect(Array.isArray(records)).toBe(true);
  });
});
