import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { LeadPipelineBoard } from "./LeadPipelineBoard";

describe("LeadPipelineBoard", () => {
  it("shows pipeline counts per status", () => {
    render(
      <LeadPipelineBoard
        leads={[
          {
            id: "1",
            name: "John",
            phone: "4075551111",
            service: "Interior",
            locale: "en",
            source: "free-estimate",
            status: "NEW",
            createdAt: new Date().toISOString()
          }
        ]}
      />
    );

    expect(screen.getByText("New")).toBeInTheDocument();
    expect(screen.getByText("1")).toBeInTheDocument();
  });
});
