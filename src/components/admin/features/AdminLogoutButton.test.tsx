import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { AdminLogoutButton } from "./AdminLogoutButton";

describe("AdminLogoutButton", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("calls logout endpoint on click", async () => {
    const fetchMock = vi.fn(async () => ({ ok: true }));
    vi.stubGlobal("fetch", fetchMock as unknown as typeof fetch);
    Object.defineProperty(window, "fetch", {
      value: fetchMock,
      writable: true
    });

    render(<AdminLogoutButton />);

    fireEvent.click(screen.getByRole("button", { name: "Logout" }));

    expect(fetchMock).toHaveBeenCalledWith("/api/admin/logout", { method: "POST" });
  });
});
