import { useTranslations } from "next-intl";
import Image from "next/image";
import { SiteHeader } from "@/components/shared/SiteHeader";
import { PageIntro } from "@/components/public/sections/PageIntro";

const ABOUT_IMAGE_URL = "/images/placeholders/hero-painting.webp";

export default function AboutPage() {
  const t = useTranslations("Pages");

  return (
    <main className="min-h-screen">
      <SiteHeader />
      <PageIntro eyebrow={t("eyebrow")} title={t("aboutTitle")} description={t("aboutDescription")} />
      <section className="mx-auto w-full max-w-6xl px-4 pb-20 pt-10 md:px-6">
        <div className="grid gap-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:grid-cols-[1.1fr,1fr] md:p-8">
          <div>
            <p className="text-base leading-relaxed text-slate-700">{t("aboutBodyOne")}</p>
            <p className="mt-4 text-base leading-relaxed text-slate-700">{t("aboutBodyTwo")}</p>
          </div>
          <Image
            src={ABOUT_IMAGE_URL}
            alt="Painting team preparing residential project"
            width={1280}
            height={720}
            className="h-64 w-full rounded-2xl border border-slate-200 object-cover md:h-full"
          />
        </div>
      </section>
    </main>
  );
}
