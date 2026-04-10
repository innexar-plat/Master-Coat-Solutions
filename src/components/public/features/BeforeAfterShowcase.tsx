import Image from "next/image";

const BEFORE_IMAGE_URL = "/images/placeholders/house-before.png";
const AFTER_IMAGE_URL = "/images/placeholders/house-after.png";

type BeforeAfterShowcaseProps = {
  title: string;
  beforeLabel: string;
  afterLabel: string;
};

export function BeforeAfterShowcase({ title, beforeLabel, afterLabel }: BeforeAfterShowcaseProps) {
  return (
    <section id="gallery" className="mx-auto w-full max-w-6xl px-4 pb-16 md:px-6 reveal-up" style={{ animationDelay: "220ms" }}>
      <h2 className="mb-6 text-3xl font-black tracking-tight text-theme-secondary">{title}</h2>
      <div className="grid gap-4 md:grid-cols-2">
        <article className="overflow-hidden rounded-2xl border border-theme bg-theme-surface shadow-sm">
          <Image src={BEFORE_IMAGE_URL} alt="Before painting example" width={960} height={360} className="h-56 w-full object-cover" />
          <div className="p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-theme-soft">{beforeLabel}</p>
            <p className="mt-2 text-sm text-theme-soft">Aged paint, stains and patchy finishes before restoration.</p>
          </div>
        </article>
        <article className="overflow-hidden rounded-2xl border border-theme bg-theme-surface shadow-card">
          <Image src={AFTER_IMAGE_URL} alt="After painting example" width={960} height={360} className="h-56 w-full object-cover" />
          <div className="p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-theme-primary">{afterLabel}</p>
            <p className="mt-2 text-sm text-theme-soft">Fresh premium coat with clean lines and durable residential protection.</p>
          </div>
        </article>
      </div>
    </section>
  );
}
