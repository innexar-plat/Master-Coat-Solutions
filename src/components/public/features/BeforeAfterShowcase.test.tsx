import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { BeforeAfterShowcase } from "./BeforeAfterShowcase";

describe("BeforeAfterShowcase", () => {
  it("renders section title and labels", () => {
    render(
      <BeforeAfterShowcase
        title="Before and After"
        beforeLabel="Before"
        afterLabel="After"
      />,
    );

    expect(screen.getByRole("heading", { level: 2, name: "Before and After" })).toBeInTheDocument();
    expect(screen.getByText("Before")).toBeInTheDocument();
    expect(screen.getByText("After")).toBeInTheDocument();
  });
});
