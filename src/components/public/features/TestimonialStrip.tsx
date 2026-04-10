type TestimonialItem = {
  quote: string;
  author: string;
  city: string;
};

type TestimonialStripProps = {
  title: string;
  items: TestimonialItem[];
};

export function TestimonialStrip({ title, items }: TestimonialStripProps) {
  return (
    <section className="mx-auto w-full max-w-6xl px-4 pb-20 md:px-6 reveal-up" style={{ animationDelay: "240ms" }}>
      <h2 className="mb-6 text-3xl font-black tracking-tight text-theme-secondary">{title}</h2>
      <div className="grid gap-4 md:grid-cols-3">
        {items.map((item) => (
          <article key={`${item.author}-${item.city}`} className="rounded-2xl border border-theme bg-theme-surface p-5 shadow-sm">
            <p className="text-sm leading-relaxed text-theme-soft">&ldquo;{item.quote}&rdquo;</p>
            <p className="mt-4 text-sm font-bold text-theme-secondary">{item.author}</p>
            <p className="text-xs uppercase tracking-wide text-theme-primary">{item.city}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
