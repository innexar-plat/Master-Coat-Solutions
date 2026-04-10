import { render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { describe, expect, it, vi } from "vitest";
import { SiteHeader } from "./SiteHeader";

vi.mock("./LanguageSwitcher", () => ({
  LanguageSwitcher: () => <div data-testid="language-switcher" />
}));

describe("SiteHeader", () => {
  it("renders strong call CTA in English with tel link", () => {
    render(
      <NextIntlClientProvider
        locale="en"
        messages={{
          Home: {
            navHome: "Home",
            navServices: "Services",
            navGallery: "Gallery",
            navBlog: "Blog",
            navContact: "Contact"
          }
        }}
      >
        <SiteHeader locale="en" />
      </NextIntlClientProvider>
    );

    const callLink = screen.getByRole("link", { name: "Call Now (407) 555-1200" });

    expect(callLink).toBeInTheDocument();
    expect(callLink).toHaveAttribute("href", "tel:+14075551200");
  });
});
