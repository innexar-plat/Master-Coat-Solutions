import { render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { describe, expect, it } from "vitest";
import { ServiceAreasGrid } from "./ServiceAreasGrid";

describe("ServiceAreasGrid", () => {
  it("renders area cards and links", () => {
    render(
      <NextIntlClientProvider locale="en" messages={{}}>
        <ServiceAreasGrid
          title="Areas"
          ctaLabel="View area"
          areas={[
            {
              slug: "orlando",
              city: "Orlando",
              state: "FL",
              summary: "Summary"
            }
          ]}
        />
      </NextIntlClientProvider>
    );

    expect(screen.getByRole("heading", { level: 2, name: "Areas" })).toBeInTheDocument();
    expect(screen.getByText("Orlando, FL")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "View area" })).toBeInTheDocument();
  });
});
