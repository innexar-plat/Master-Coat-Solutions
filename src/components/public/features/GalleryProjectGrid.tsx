"use client";

import Image from "next/image";
import { useState } from "react";

const GALLERY_FALLBACK_IMAGE = "/images/placeholders/exterior-painting.jpeg";

type GalleryProject = {
  title: string;
  location: string;
  service: string;
  categoryName?: string;
  albumName?: string;
  imageUrl?: string;
};

type GalleryProjectGridProps = {
  title: string;
  projects: GalleryProject[];
  categories?: string[];
};

const ALL_CATEGORY = "All";

export function GalleryProjectGrid({ title, projects, categories = [] }: GalleryProjectGridProps) {
  const [active, setActive] = useState(ALL_CATEGORY);

  const filtered =
    active === ALL_CATEGORY
      ? projects
      : projects.filter((p) => p.categoryName === active);

  const tabs = [ALL_CATEGORY, ...categories];

  return (
    <section className="mx-auto w-full max-w-6xl px-4 pb-20 pt-10 md:px-6">
      <h2 className="mb-6 text-3xl font-black tracking-tight text-slate-900">{title}</h2>

      {categories.length > 0 && (
        <div className="mb-8 flex flex-wrap gap-2">
          {tabs.map((cat) => (
            <button
              key={cat}
              onClick={() => setActive(cat)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                active === cat
                  ? "bg-slate-900 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {filtered.length === 0 ? (
        <p className="text-center text-slate-500">No projects found in this category.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((project) => (
            <article key={`${project.title}-${project.location}`} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_18px_34px_-26px_rgba(15,23,42,0.55)]">
              <Image
                src={project.imageUrl ?? GALLERY_FALLBACK_IMAGE}
                alt={project.title}
                width={640}
                height={360}
                className="h-44 w-full object-cover"
              />
              <div className="p-4">
                <h3 className="text-lg font-bold text-slate-900">{project.title}</h3>
                <p className="text-sm uppercase tracking-wide text-slate-500">{project.location}</p>
                <p className="mt-1 text-sm text-slate-600">{project.service}</p>
                {(project.categoryName || project.albumName) ? (
                  <p className="mt-1 text-xs text-slate-500">
                    {project.categoryName ?? "General"} • {project.albumName ?? "Portfolio"}
                  </p>
                ) : null}
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
