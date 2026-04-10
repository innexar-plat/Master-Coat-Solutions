import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { AdminSocialLinksForm } from "./AdminSocialLinksForm";

describe("AdminSocialLinksForm", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("loads and saves social links settings", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          data: {
            facebookUrl: "",
            instagramUrl: "",
            linkedinUrl: "",
            youtubeUrl: "",
            tiktokUrl: "",
            xUrl: ""
          }
        })
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: {} })
      });

    vi.stubGlobal("fetch", fetchMock as unknown as typeof fetch);
    Object.defineProperty(window, "fetch", { value: fetchMock, writable: true });

    render(<AdminSocialLinksForm />);

    const instagramInput = await screen.findByPlaceholderText("https://instagram.com/...");
    fireEvent.change(instagramInput, { target: { value: "https://instagram.com/mastercoat" } });
    fireEvent.submit(screen.getByRole("form", { name: "social-links-form" }));

    expect(await screen.findByText((content) => content.includes("✓"))).toBeInTheDocument();
  });
});
