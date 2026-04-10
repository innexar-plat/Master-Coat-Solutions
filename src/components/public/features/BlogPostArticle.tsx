import { Link } from "@/i18n/navigation";

type BlogPostArticleProps = {
  category: string;
  title: string;
  publishedAt: string;
  publishedPrefix: string;
  paragraphs: string[];
  backToListLabel: string;
};

export function BlogPostArticle({
  category,
  title,
  publishedAt,
  publishedPrefix,
  paragraphs,
  backToListLabel
}: BlogPostArticleProps) {
  return (
    <section className="mx-auto w-full max-w-4xl px-4 pb-24 pt-10 md:px-6">
      <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
        <p className="text-xs font-semibold uppercase tracking-wide text-brand-700">{category}</p>
        <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-900 md:text-4xl">{title}</h1>
        <p className="mt-3 text-sm text-slate-500">
          {publishedPrefix}: {new Date(publishedAt).toLocaleDateString()}
        </p>

        <div className="mt-6 space-y-4 text-base leading-relaxed text-slate-700">
          {paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>

        <Link
          href="/blog"
          className="mt-8 inline-flex rounded-full border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-100"
        >
          {backToListLabel}
        </Link>
      </article>
    </section>
  );
}
