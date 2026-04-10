import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { PageIntro } from "./PageIntro";

describe("PageIntro", () => {
  it("renders page heading and description", () => {
    render(<PageIntro title="Services" description="Professional painting services" eyebrow="Vini Painting" />);

    expect(screen.getByRole("heading", { level: 1, name: "Services" })).toBeInTheDocument();
    expect(screen.getByText("Professional painting services")).toBeInTheDocument();
    expect(screen.getByText("Vini Painting")).toBeInTheDocument();
  });
});
