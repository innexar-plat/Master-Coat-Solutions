type FaqItem = {
  question: string;
  answer: string;
};

type FaqListProps = {
  title: string;
  items: FaqItem[];
};

export function FaqList({ title, items }: FaqListProps) {
  return (
    <section className="mx-auto w-full max-w-6xl px-4 pb-20 pt-10 md:px-6">
      <h2 className="mb-6 text-3xl font-black tracking-tight text-slate-900">{title}</h2>
      <div className="grid gap-3">
        {items.map((item) => (
          <article key={item.question} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900">{item.question}</h3>
            <p className="mt-2 text-sm text-slate-600">{item.answer}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
