import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/modules/auth/services/admin-session.service", () => ({
  getAdminCredentials: vi.fn(),
  createAdminSessionToken: vi.fn()
}));

import {
  createAdminSessionToken,
  getAdminCredentials
} from "@/modules/auth/services/admin-session.service";
import { POST } from "./route";

describe("POST /api/admin/login", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(getAdminCredentials).mockReturnValue({
      email: "admin@vinipainting.com",
      password: "Admin123!",
      role: "ADMIN"
    });
    vi.mocked(createAdminSessionToken).mockReturnValue("token");
  });

  it("returns 200 with valid credentials", async () => {
    const response = await POST(
      new Request("http://localhost/api/admin/login", {
        method: "POST",
        body: JSON.stringify({
          email: "admin@vinipainting.com",
          password: "Admin123!"
        })
      })
    );

    expect(response.status).toBe(200);
  });

  it("returns 401 with invalid credentials", async () => {
    const response = await POST(
      new Request("http://localhost/api/admin/login", {
        method: "POST",
        body: JSON.stringify({
          email: "wrong@vinipainting.com",
          password: "wrong-pass"
        })
      })
    );

    expect(response.status).toBe(401);
  });

  it("returns 400 with invalid payload", async () => {
    const response = await POST(new Request("http://localhost/api/admin/login", { method: "POST", body: "{}" }));
    expect(response.status).toBe(400);
  });
});
