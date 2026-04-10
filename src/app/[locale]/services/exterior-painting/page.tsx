import { useTranslations } from "next-intl";
import Image from "next/image";
import { SiteHeader } from "@/components/shared/SiteHeader";
import { PageIntro } from "@/components/public/sections/PageIntro";
import { Link } from "@/i18n/navigation";

const EXTERIOR_IMAGE_URL = "/images/placeholders/exterior-painting.jpeg";

export default function ExteriorPaintingServicePage() {
  const t = useTranslations("Pages");

  return (
    <main className="min-h-screen">
      <SiteHeader />
      <PageIntro
        eyebrow={t("eyebrow")}
        title={t("serviceExteriorTitle")}
        description={t("serviceExteriorDescription")}
      />

      <section className="mx-auto grid w-full max-w-6xl gap-6 px-4 pb-24 pt-10 md:grid-cols-[1fr,1.1fr] md:px-6">
        <Image src={EXTERIOR_IMAGE_URL} alt="Exterior painting service" width={960} height={640} className="h-72 w-full rounded-3xl border border-theme object-cover shadow-sm md:h-full" />
        <article className="rounded-3xl border border-theme bg-theme-surface p-7 shadow-sm">
          <p className="text-base text-theme-soft">{t("serviceExteriorBodyOne")}</p>
          <p className="mt-4 text-base text-theme-soft">{t("serviceExteriorBodyTwo")}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="https://wa.me/13213109079" className="rounded-full bg-theme-primary px-5 py-3 text-sm font-semibold text-white transition hover:bg-theme-primary-strong">
              WhatsApp 321-310-9079
            </a>
            <Link href="/services" className="rounded-full border border-theme px-5 py-3 text-sm font-semibold text-theme-secondary transition hover:bg-theme-surface-soft">
              {t("serviceBackToServices")}
            </Link>
          </div>
        </article>
      </section>
    </main>
  );
}
