import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { EstimateLeadForm } from "./EstimateLeadForm";

describe("EstimateLeadForm", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("submits payload and shows success feedback", async () => {
    const fetchMock = vi.fn<(input: string, init?: RequestInit) => Promise<{ ok: boolean }>>(
      async () => ({ ok: true })
    );
    vi.stubGlobal("fetch", fetchMock as unknown as typeof fetch);
    Object.defineProperty(window, "fetch", {
      value: fetchMock,
      writable: true
    });

    render(
      <EstimateLeadForm
        ctaLabel="Send"
        locale="en"
        placeholders={{
          name: "Name",
          phone: "Phone",
          email: "Email",
          service: "Service",
          details: "Details"
        }}
        feedback={{ success: "Sent", error: "Error" }}
      />
    );

    fireEvent.change(screen.getByPlaceholderText("Name"), { target: { value: "John Doe" } });
    fireEvent.change(screen.getByPlaceholderText("Phone"), { target: { value: "4075551234" } });
    fireEvent.change(screen.getByPlaceholderText("Service"), { target: { value: "Interior Painting" } });

    fireEvent.submit(screen.getByRole("form", { name: "estimate-form" }));

    expect(fetchMock).toHaveBeenCalled();
    expect(fetchMock.mock.calls[0]?.[0]).toBe("/api/leads");
    expect(await screen.findByText("Sent")).toBeInTheDocument();
  });
});
