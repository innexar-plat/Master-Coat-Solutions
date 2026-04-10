type PageIntroProps = {
  eyebrow?: string;
  title: string;
  description: string;
};

export function PageIntro({ eyebrow, title, description }: PageIntroProps) {
  return (
    <section className="mx-auto w-full max-w-6xl px-4 pt-12 md:px-6 md:pt-16">
      <div className="rounded-3xl border border-theme bg-theme-surface p-8 shadow-[0_22px_50px_-30px_rgba(15,23,42,0.55)]">
        {eyebrow ? (
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-theme-primary">{eyebrow}</p>
        ) : null}
        <h1 className="mt-2 text-4xl font-black tracking-tight text-theme-secondary md:text-5xl">{title}</h1>
        <p className="mt-4 max-w-3xl text-base text-theme-soft md:text-lg">{description}</p>
      </div>
    </section>
  );
}
