import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { AnimatedTitlePaint } from "./AnimatedTitlePaint";

describe("AnimatedTitlePaint", () => {
  it("renders title and subtitle", () => {
    render(<AnimatedTitlePaint title="Orlando Premium Painting" subtitle="Free estimate today" />);

    expect(screen.getByRole("heading", { level: 1, name: "Orlando Premium Painting" })).toBeInTheDocument();
    expect(screen.getByText("Free estimate today")).toBeInTheDocument();
  });

  it("supports center alignment", () => {
    const { container } = render(<AnimatedTitlePaint title="Center Title" align="center" />);

    expect(container.firstChild).toHaveClass("text-center");
  });
});
