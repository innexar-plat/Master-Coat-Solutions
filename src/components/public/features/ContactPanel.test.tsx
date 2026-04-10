import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ContactPanel } from "./ContactPanel";

describe("ContactPanel", () => {
  it("renders contact details", () => {
    render(
      <ContactPanel
        title="Contact Us"
        description="Request your estimate"
        phone="(407) 555-1200"
        email="hello@vinipainting.com"
        address="Orlando, FL"
      />,
    );

    expect(screen.getByRole("heading", { level: 2, name: "Contact Us" })).toBeInTheDocument();
    expect(screen.getByText("(407) 555-1200")).toBeInTheDocument();
    expect(screen.getByText("hello@vinipainting.com")).toBeInTheDocument();
  });
});
