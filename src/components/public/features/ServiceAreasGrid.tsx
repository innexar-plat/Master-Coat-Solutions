import { Link } from "@/i18n/navigation";

type ServiceAreaCard = {
  slug: string;
  city: string;
  state: string;
  summary: string;
};

type ServiceAreasGridProps = {
  title: string;
  ctaLabel: string;
  areas: ServiceAreaCard[];
};

export function ServiceAreasGrid({ title, ctaLabel, areas }: ServiceAreasGridProps) {
  return (
    <section className="mx-auto w-full max-w-6xl px-4 pb-20 pt-10 md:px-6">
      <h2 className="mb-6 text-3xl font-black tracking-tight text-slate-900">{title}</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {areas.map((area) => (
          <article key={area.slug} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900">
              {area.city}, {area.state}
            </h3>
            <p className="mt-2 text-sm text-slate-600">{area.summary}</p>
            <Link
              href={`/areas/${area.slug}`}
              className="mt-4 inline-flex rounded-full border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-100"
            >
              {ctaLabel}
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}
