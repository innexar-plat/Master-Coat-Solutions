import { Link } from "@/i18n/navigation";

type BlogPostCard = {
  slug: string;
  category: string;
  publishedAt: string;
  title: string;
  excerpt: string;
};

type BlogPostGridProps = {
  title: string;
  readMoreLabel: string;
  publishedPrefix: string;
  posts: BlogPostCard[];
};

export function BlogPostGrid({ title, readMoreLabel, publishedPrefix, posts }: BlogPostGridProps) {
  return (
    <section className="mx-auto w-full max-w-6xl px-4 pb-20 pt-10 md:px-6">
      <h2 className="mb-6 text-3xl font-black tracking-tight text-slate-900">{title}</h2>
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <article key={post.slug} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-brand-700">{post.category}</p>
            <h3 className="mt-2 text-lg font-bold text-slate-900">{post.title}</h3>
            <p className="mt-2 text-sm text-slate-600">{post.excerpt}</p>
            <p className="mt-3 text-xs text-slate-500">
              {publishedPrefix}: {new Date(post.publishedAt).toLocaleDateString()}
            </p>
            <Link
              href={`/blog/${post.slug}`}
              className="mt-4 inline-flex rounded-full border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-100"
            >
              {readMoreLabel}
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}
