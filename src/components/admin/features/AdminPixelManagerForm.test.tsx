import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { AdminPixelManagerForm } from "./AdminPixelManagerForm";

describe("AdminPixelManagerForm", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("loads and saves pixel settings", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          data: {
            enabled: false,
            ga4MeasurementId: "",
            gtmId: "",
            metaPixelId: "",
            googleAdsId: "",
            tiktokPixelId: ""
          }
        })
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: {} })
      });

    vi.stubGlobal("fetch", fetchMock as unknown as typeof fetch);
    Object.defineProperty(window, "fetch", { value: fetchMock, writable: true });

    render(<AdminPixelManagerForm />);

    const checkbox = await screen.findByRole("checkbox");
    fireEvent.click(checkbox);
    fireEvent.submit(screen.getByRole("form", { name: "pixel-manager-form" }));

    expect(await screen.findByText("Settings saved successfully.")).toBeInTheDocument();
  });
});
