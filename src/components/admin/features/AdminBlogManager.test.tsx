import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { AdminBlogManager } from "./AdminBlogManager";

describe("AdminBlogManager", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("loads and deletes a post", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          data: [
            {
              slug: "sample-post",
              category: "Painting Tips",
              publishedAt: "2026-04-01T10:00:00.000Z",
              title: { en: "Sample EN", pt: "Exemplo PT", es: "Ejemplo ES" },
              excerpt: { en: "Excerpt EN", pt: "Resumo PT", es: "Resumen ES" },
              content: {
                en: ["Content EN long enough"],
                pt: ["Conteudo PT longo suficiente"],
                es: ["Contenido ES suficientemente largo"]
              }
            }
          ]
        })
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({})
      });

    vi.stubGlobal("fetch", fetchMock as unknown as typeof fetch);
    Object.defineProperty(window, "fetch", { value: fetchMock, writable: true });

    render(<AdminBlogManager />);

    expect(await screen.findByText("Sample EN")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Delete" }));

    expect(fetchMock).toHaveBeenCalledWith("/api/admin/blog/sample-post", { method: "DELETE" });

    await waitFor(() => {
      expect(screen.queryByText("Sample EN")).not.toBeInTheDocument();
    });
  });

  it("shows an error message when initial load fails", async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: false, json: async () => ({}) });
    vi.stubGlobal("fetch", fetchMock as unknown as typeof fetch);
    Object.defineProperty(window, "fetch", { value: fetchMock, writable: true });

    render(<AdminBlogManager />);
    expect(await screen.findByText("Could not load or save blog posts.")).toBeInTheDocument();
  });
});
