import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ServiceShowcaseCard } from "./ServiceShowcaseCard";

describe("ServiceShowcaseCard", () => {
  it("renders title, description and default CTA", () => {
    render(
      <ServiceShowcaseCard
        title="Interior Painting"
        description="Premium wall and ceiling finishes"
      />,
    );

    expect(screen.getByRole("heading", { level: 3, name: "Interior Painting" })).toBeInTheDocument();
    expect(screen.getByText("Premium wall and ceiling finishes")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Get Free Estimate" })).toBeInTheDocument();
  });

  it("renders image when imageUrl is provided", () => {
    render(
      <ServiceShowcaseCard
        title="Exterior Painting"
        description="Weather-resistant painting system"
        imageUrl="/images/exterior.jpg"
      />,
    );

    expect(screen.getByRole("img", { name: "Exterior Painting" })).toBeInTheDocument();
  });
});
