import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { GalleryProjectGrid } from "./GalleryProjectGrid";

describe("GalleryProjectGrid", () => {
  it("renders gallery project cards", () => {
    render(
      <GalleryProjectGrid
        title="Recent Projects"
        projects={[
          { title: "Exterior Refresh", location: "Orlando", service: "Exterior Painting" },
          { title: "Interior Upgrade", location: "Winter Park", service: "Interior Painting" }
        ]}
      />,
    );

    expect(screen.getByRole("heading", { level: 2, name: "Recent Projects" })).toBeInTheDocument();
    expect(screen.getByText("Exterior Refresh")).toBeInTheDocument();
    expect(screen.getByText("Winter Park")).toBeInTheDocument();
  });
});
