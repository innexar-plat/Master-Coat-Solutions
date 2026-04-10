"use client";

import { useEffect, useState } from "react";
import { useAdminI18n } from "@/components/admin/layout/AdminI18nProvider";
import type { CreateBlogPostInput } from "@/modules/blog/dtos/manage-blog-post.dto";
import type { StoredBlogPost } from "@/modules/blog/services/blog-storage.service";

type AdminBlogFormState = {
  slug: string;
  category: string;
  titleEn: string;
  titlePt: string;
  titleEs: string;
  excerptEn: string;
  excerptPt: string;
  excerptEs: string;
  contentEn: string;
  contentPt: string;
  contentEs: string;
};

const EMPTY_STATE: AdminBlogFormState = {
  slug: "",
  category: "",
  titleEn: "",
  titlePt: "",
  titleEs: "",
  excerptEn: "",
  excerptPt: "",
  excerptEs: "",
  contentEn: "",
  contentPt: "",
  contentEs: ""
};

function toParagraphs(raw: string): string[] {
  return raw
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0);
}

export function AdminBlogManager() {
  const { t } = useAdminI18n();
  const [posts, setPosts] = useState<StoredBlogPost[]>([]);
  const [state, setState] = useState<AdminBlogFormState>(EMPTY_STATE);
  const [editingSlug, setEditingSlug] = useState<string | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "saving" | "error">("loading");

  useEffect(() => {
    async function load() {
      try {
        const response = await fetch("/api/admin/blog");

        if (!response.ok) {
          throw new Error("Failed to load posts");
        }

        const json = (await response.json()) as { data: StoredBlogPost[] };
        setPosts(json.data);
        setStatus("ready");
      } catch {
        setStatus("error");
      }
    }

    load();
  }, []);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("saving");

    const payload: CreateBlogPostInput = {
      slug: state.slug.trim(),
      category: state.category.trim(),
      title: {
        en: state.titleEn.trim(),
        pt: state.titlePt.trim(),
        es: state.titleEs.trim()
      },
      excerpt: {
        en: state.excerptEn.trim(),
        pt: state.excerptPt.trim(),
        es: state.excerptEs.trim()
      },
      content: {
        en: toParagraphs(state.contentEn),
        pt: toParagraphs(state.contentPt),
        es: toParagraphs(state.contentEs)
      }
    };

    const isEditing = Boolean(editingSlug);
    const response = await fetch(isEditing ? `/api/admin/blog/${editingSlug}` : "/api/admin/blog", {
      method: isEditing ? "PATCH" : "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      setStatus("error");
      return;
    }

    const json = (await response.json()) as { data: StoredBlogPost };

    if (isEditing) {
      setPosts((current) => current.map((post) => (post.slug === editingSlug ? json.data : post)));
    } else {
      setPosts((current) => [json.data, ...current]);
    }

    setEditingSlug(null);
    setState(EMPTY_STATE);
    setStatus("ready");
  }

  function handleEdit(post: StoredBlogPost) {
    setEditingSlug(post.slug);
    setState({
      slug: post.slug,
      category: post.category,
      titleEn: post.title.en,
      titlePt: post.title.pt,
      titleEs: post.title.es,
      excerptEn: post.excerpt.en,
      excerptPt: post.excerpt.pt,
      excerptEs: post.excerpt.es,
      contentEn: post.content.en.join("\n"),
      contentPt: post.content.pt.join("\n"),
      contentEs: post.content.es.join("\n")
    });
    setStatus("ready");
  }

  function handleCancelEdit() {
    setEditingSlug(null);
    setState(EMPTY_STATE);
    setStatus("ready");
  }

  async function handleDelete(slug: string) {
    const response = await fetch(`/api/admin/blog/${slug}`, {
      method: "DELETE"
    });

    if (!response.ok) {
      return;
    }

    setPosts((current) => current.filter((entry) => entry.slug !== slug));
  }

  if (status === "loading") {
    return <p className="text-sm text-slate-600">{t("blog.loading")}</p>;
  }

  if (status === "error") {
    return <p className="text-sm font-semibold text-red-700">{t("blog.error")}</p>;
  }

  return (
    <div className="grid gap-6">
      <form onSubmit={handleSubmit} className="grid gap-3 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-lg font-black tracking-tight text-slate-900">
            {editingSlug ? t("blog.edit") : t("blog.create")}
          </h2>
          {editingSlug ? (
            <button
              type="button"
              onClick={handleCancelEdit}
              className="rounded-full border border-slate-300 px-3 py-1 text-xs font-semibold text-slate-700 transition hover:bg-slate-100"
            >
              {t("blog.cancelEdit")}
            </button>
          ) : null}
        </div>
        <input
          value={state.slug}
          onChange={(event) => setState((current) => ({ ...current, slug: event.target.value }))}
          className="rounded-xl border border-slate-300 px-3 py-2 text-sm"
          placeholder="slug"
        />
        <input
          value={state.category}
          onChange={(event) => setState((current) => ({ ...current, category: event.target.value }))}
          className="rounded-xl border border-slate-300 px-3 py-2 text-sm"
          placeholder="category"
        />
        <input
          value={state.titleEn}
          onChange={(event) => setState((current) => ({ ...current, titleEn: event.target.value }))}
          className="rounded-xl border border-slate-300 px-3 py-2 text-sm"
          placeholder="title en"
        />
        <input
          value={state.titlePt}
          onChange={(event) => setState((current) => ({ ...current, titlePt: event.target.value }))}
          className="rounded-xl border border-slate-300 px-3 py-2 text-sm"
          placeholder="title pt"
        />
        <input
          value={state.titleEs}
          onChange={(event) => setState((current) => ({ ...current, titleEs: event.target.value }))}
          className="rounded-xl border border-slate-300 px-3 py-2 text-sm"
          placeholder="title es"
        />
        <input
          value={state.excerptEn}
          onChange={(event) => setState((current) => ({ ...current, excerptEn: event.target.value }))}
          className="rounded-xl border border-slate-300 px-3 py-2 text-sm"
          placeholder="excerpt en"
        />
        <input
          value={state.excerptPt}
          onChange={(event) => setState((current) => ({ ...current, excerptPt: event.target.value }))}
          className="rounded-xl border border-slate-300 px-3 py-2 text-sm"
          placeholder="excerpt pt"
        />
        <input
          value={state.excerptEs}
          onChange={(event) => setState((current) => ({ ...current, excerptEs: event.target.value }))}
          className="rounded-xl border border-slate-300 px-3 py-2 text-sm"
          placeholder="excerpt es"
        />
        <textarea
          value={state.contentEn}
          onChange={(event) => setState((current) => ({ ...current, contentEn: event.target.value }))}
          className="min-h-24 rounded-xl border border-slate-300 px-3 py-2 text-sm"
          placeholder="content en (one paragraph per line)"
        />
        <textarea
          value={state.contentPt}
          onChange={(event) => setState((current) => ({ ...current, contentPt: event.target.value }))}
          className="min-h-24 rounded-xl border border-slate-300 px-3 py-2 text-sm"
          placeholder="content pt (one paragraph per line)"
        />
        <textarea
          value={state.contentEs}
          onChange={(event) => setState((current) => ({ ...current, contentEs: event.target.value }))}
          className="min-h-24 rounded-xl border border-slate-300 px-3 py-2 text-sm"
          placeholder="content es (one paragraph per line)"
        />

        <button type="submit" className="w-fit rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold text-white transition hover:bg-slate-700">
          {editingSlug ? t("blog.saveChanges") : t("blog.savePost")}
        </button>
      </form>

      <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
        <h2 className="text-lg font-black tracking-tight text-slate-900">{t("blog.publishedPosts")}</h2>
        <ul className="mt-4 grid gap-2">
          {posts.map((post) => (
            <li key={post.slug} className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2 text-sm">
              <div>
                <p className="font-semibold text-slate-900">{post.title.en}</p>
                <p className="text-xs text-slate-600">{post.slug}</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleEdit(post)}
                  className="rounded-lg border border-slate-300 px-3 py-1 text-xs font-semibold text-slate-700 transition hover:bg-slate-100"
                >
                  {t("common.edit")}
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(post.slug)}
                  className="rounded-lg border border-red-200 px-3 py-1 text-xs font-semibold text-red-700 transition hover:bg-red-50"
                >
                  {t("common.delete")}
                </button>
              </div>
            </li>
          ))}
          {posts.length === 0 ? <li className="text-sm text-slate-600">{t("blog.noPosts")}</li> : null}
        </ul>
      </section>
    </div>
  );
}
