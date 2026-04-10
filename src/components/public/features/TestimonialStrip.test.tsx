import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { TestimonialStrip } from "./TestimonialStrip";

describe("TestimonialStrip", () => {
  it("renders testimonials list", () => {
    render(
      <TestimonialStrip
        title="Client Reviews"
        items={[
          { quote: "Great result", author: "John", city: "Orlando" },
          { quote: "Fast and clean", author: "Maria", city: "Kissimmee" }
        ]}
      />,
    );

    expect(screen.getByRole("heading", { level: 2, name: "Client Reviews" })).toBeInTheDocument();
    expect(screen.getByText((content) => content.includes("Great result"))).toBeInTheDocument();
    expect(screen.getByText("Maria")).toBeInTheDocument();
  });
});
