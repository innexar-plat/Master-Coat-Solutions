import { render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { describe, expect, it } from "vitest";
import { BlogPostGrid } from "./BlogPostGrid";

describe("BlogPostGrid", () => {
  it("renders blog cards and read links", () => {
    render(
      <NextIntlClientProvider locale="en" messages={{}}>
        <BlogPostGrid
          title="Latest Articles"
          readMoreLabel="Read article"
          publishedPrefix="Published"
          posts={[
            {
              slug: "post-one",
              category: "Tips",
              publishedAt: "2026-03-30T09:00:00.000Z",
              title: "Post One",
              excerpt: "Excerpt"
            }
          ]}
        />
      </NextIntlClientProvider>
    );

    expect(screen.getByRole("heading", { level: 2, name: "Latest Articles" })).toBeInTheDocument();
    expect(screen.getByText("Post One")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Read article" })).toBeInTheDocument();
  });
});
