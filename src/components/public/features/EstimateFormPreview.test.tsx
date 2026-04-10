import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { EstimateFormPreview } from "./EstimateFormPreview";

describe("EstimateFormPreview", () => {
  it("renders estimate form preview and CTA", () => {
    render(
      <EstimateFormPreview
        title="Free Estimate"
        ctaLabel="Send Request"
        locale="en"
        placeholders={{
          name: "Name",
          phone: "Phone",
          email: "Email",
          service: "Service",
          details: "Details"
        }}
        feedback={{
          success: "Sent",
          error: "Error"
        }}
      />
    );

    expect(screen.getByRole("heading", { level: 2, name: "Free Estimate" })).toBeInTheDocument();
    expect(screen.getByRole("form", { name: "estimate-form" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Send Request" })).toBeInTheDocument();
  });
});
