import Image from "next/image";

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
};

export function GalleryProjectGrid({ title, projects }: GalleryProjectGridProps) {
  return (
    <section className="mx-auto w-full max-w-6xl px-4 pb-20 pt-10 md:px-6">
      <h2 className="mb-6 text-3xl font-black tracking-tight text-slate-900">{title}</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
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
    </section>
  );
}
