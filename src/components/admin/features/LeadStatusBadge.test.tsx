import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { LeadStatusBadge } from "./LeadStatusBadge";

describe("LeadStatusBadge", () => {
  it("renders status label", () => {
    render(<LeadStatusBadge status="CONTACTED" />);

    expect(screen.getByText("Contacted")).toBeInTheDocument();
  });
});
