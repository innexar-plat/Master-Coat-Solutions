import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { FaqList } from "./FaqList";

describe("FaqList", () => {
  it("renders faq items", () => {
    render(
      <FaqList
        title="FAQ"
        items={[
          { question: "Q1", answer: "A1" },
          { question: "Q2", answer: "A2" }
        ]}
      />
    );

    expect(screen.getByRole("heading", { level: 2, name: "FAQ" })).toBeInTheDocument();
    expect(screen.getByText("Q1")).toBeInTheDocument();
    expect(screen.getByText("A2")).toBeInTheDocument();
  });
});
