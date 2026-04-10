import { describe, expect, it } from "vitest";
import { POST } from "./route";

describe("POST /api/admin/logout", () => {
  it("returns 200 and clears cookie", async () => {
    const response = await POST(new Request("http://localhost/api/admin/logout", { method: "POST" }));
    expect(response.status).toBe(200);
    const setCookie = response.headers.get("set-cookie") ?? "";
    expect(setCookie).toContain("admin_session=");
    expect(setCookie).toContain("Max-Age=0");
  });
});
