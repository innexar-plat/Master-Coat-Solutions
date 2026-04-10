"use client";

import { useEffect, useMemo, useState } from "react";
import type { StoredLandingPage } from "@/modules/landing-pages/services/landing-page-storage.service";

type FormState = {
  slug: string;
  name: string;
  headline: string;
  status: "DRAFT" | "PUBLISHED";
};

const EMPTY_FORM: FormState = {
  slug: "",
  name: "",
  headline: "",
  status: "DRAFT"
};

export function AdminLandingPagesManager() {
  const [items, setItems] = useState<StoredLandingPage[]>([]);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "saving" | "error">("loading");

  useEffect(() => {
    async function load() {
      try {
        const response = await fetch("/api/admin/landing-pages");

        if (!response.ok) {
          throw new Error("Failed to load landing pages");
        }

        const json = (await response.json()) as { data: StoredLandingPage[] };
        setItems(json.data);
        setStatus("ready");
      } catch {
        setStatus("error");
      }
    }

    load();
  }, []);

  const sortedItems = useMemo(
    () => [...items].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)),
    [items]
  );

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("saving");

    const payload = {
      slug: form.slug.trim(),
      name: form.name.trim(),
      headline: form.headline.trim(),
      status: form.status
    };

    const isEditing = Boolean(editingId);
    const url = isEditing ? `/api/admin/landing-pages/${editingId}` : "/api/admin/landing-pages";
    const method = isEditing ? "PATCH" : "POST";

    const response = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      setStatus("error");
      return;
    }

    const json = (await response.json()) as { data: StoredLandingPage };

    if (isEditing) {
      setItems((current) => current.map((item) => (item.id === json.data.id ? json.data : item)));
    } else {
      setItems((current) => [json.data, ...current]);
    }

    setEditingId(null);
    setForm(EMPTY_FORM);
    setStatus("ready");
  }

  async function handleDelete(id: string) {
    const response = await fetch(`/api/admin/landing-pages/${id}`, { method: "DELETE" });

    if (!response.ok) {
      return;
    }

    setItems((current) => current.filter((item) => item.id !== id));

    if (editingId === id) {
      setEditingId(null);
      setForm(EMPTY_FORM);
    }
  }

  function handleEdit(item: StoredLandingPage) {
    setEditingId(item.id);
    setForm({
      slug: item.slug,
      name: item.name,
      headline: item.headline,
      status: item.status
    });
    setStatus("ready");
  }

  function handleCancelEdit() {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setStatus("ready");
  }

  if (status === "loading") {
    return <p className="text-sm text-slate-600">Loading landing pages...</p>;
  }

  if (status === "error" && items.length === 0) {
    return <p className="text-sm font-semibold text-red-700">Could not load or save landing pages.</p>;
  }

  return (
    <div className="grid gap-6">
      <form onSubmit={handleSubmit} className="grid gap-3 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-lg font-black tracking-tight text-slate-900">
            {editingId ? "Edit Landing Page" : "Create Landing Page"}
          </h2>
          {editingId ? (
            <button
              type="button"
              onClick={handleCancelEdit}
              className="rounded-full border border-slate-300 px-3 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-100"
            >
              Cancel edit
            </button>
          ) : null}
        </div>

        <input
          value={form.slug}
          onChange={(event) => setForm((current) => ({ ...current, slug: event.target.value }))}
          className="rounded-xl border border-slate-300 px-3 py-2 text-sm"
          placeholder="slug (kebab-case)"
        />
        <input
          value={form.name}
          onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
          className="rounded-xl border border-slate-300 px-3 py-2 text-sm"
          placeholder="internal name"
        />
        <textarea
          value={form.headline}
          onChange={(event) => setForm((current) => ({ ...current, headline: event.target.value }))}
          className="min-h-24 rounded-xl border border-slate-300 px-3 py-2 text-sm"
          placeholder="headline"
        />

        <select
          value={form.status}
          onChange={(event) => setForm((current) => ({ ...current, status: event.target.value as FormState["status"] }))}
          className="rounded-xl border border-slate-300 px-3 py-2 text-sm"
        >
          <option value="DRAFT">Draft</option>
          <option value="PUBLISHED">Published</option>
        </select>

        <button
          type="submit"
          disabled={status === "saving"}
          className="w-fit rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold text-white transition hover:bg-slate-700 disabled:opacity-70"
        >
          {status === "saving" ? "Saving..." : editingId ? "Save changes" : "Create page"}
        </button>

        {status === "error" ? <p className="text-sm font-semibold text-red-700">Action failed. Check fields and retry.</p> : null}
      </form>

      <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
        <h2 className="text-lg font-black tracking-tight text-slate-900">Landing Pages</h2>
        <ul className="mt-4 grid gap-3">
          {sortedItems.map((item) => (
            <li key={item.id} className="rounded-2xl border border-slate-200 p-3">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-base font-bold text-slate-900">{item.name}</p>
                  <p className="text-xs text-slate-500">/{item.slug}</p>
                  <p className="mt-1 text-sm text-slate-700">{item.headline}</p>
                  <p className="mt-1 text-xs text-slate-500">
                    Status: {item.status} · Updated: {new Date(item.updatedAt).toLocaleString()}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => handleEdit(item)}
                    className="rounded-lg border border-slate-300 px-3 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-100"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(item.id)}
                    className="rounded-lg border border-red-200 px-3 py-1 text-xs font-semibold text-red-700 hover:bg-red-50"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </li>
          ))}
          {sortedItems.length === 0 ? <li className="text-sm text-slate-600">No landing pages yet.</li> : null}
        </ul>
      </section>
    </div>
  );
}
