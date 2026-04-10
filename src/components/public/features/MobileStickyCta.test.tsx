import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { MobileStickyCta } from "./MobileStickyCta";

describe("MobileStickyCta", () => {
  it("renders CTA label", () => {
    render(<MobileStickyCta label="Get Free Estimate" />);

    expect(screen.getByRole("button", { name: "Get Free Estimate" })).toBeInTheDocument();
  });
});
