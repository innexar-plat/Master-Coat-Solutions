import { render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { describe, expect, it } from "vitest";
import { BlogPostArticle } from "./BlogPostArticle";

describe("BlogPostArticle", () => {
  it("renders article content and back link", () => {
    render(
      <NextIntlClientProvider locale="en" messages={{}}>
        <BlogPostArticle
          category="Tips"
          title="Post Title"
          publishedAt="2026-03-30T09:00:00.000Z"
          publishedPrefix="Published"
          paragraphs={["Paragraph one", "Paragraph two"]}
          backToListLabel="Back to blog"
        />
      </NextIntlClientProvider>
    );

    expect(screen.getByRole("heading", { level: 1, name: "Post Title" })).toBeInTheDocument();
    expect(screen.getByText("Paragraph one")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Back to blog" })).toBeInTheDocument();
  });
});
