import { notFound } from "next/navigation";
import { useTranslations } from "next-intl";
import { SiteHeader } from "@/components/shared/SiteHeader";
import { PageIntro } from "@/components/public/sections/PageIntro";
import { findServiceAreaBySlug } from "@/modules/areas/data/service-areas.data";

type AreaCityPageProps = {
  params: {
    locale: "en" | "pt" | "es";
    city: string;
  };
};

export default function AreaCityPage({ params }: AreaCityPageProps) {
  const t = useTranslations("Pages");
  const area = findServiceAreaBySlug(params.city, params.locale);

  if (!area) {
    notFound();
  }

  return (
    <main className="min-h-screen">
      <SiteHeader />
      <PageIntro
        eyebrow={t("eyebrow")}
        title={t("areaCityTitle", { city: area.city, state: area.state })}
        description={area.summary}
      />
      <section className="mx-auto w-full max-w-6xl px-4 pb-20 pt-10 md:px-6">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <p className="text-base leading-relaxed text-slate-700">{t("areaCityBodyOne", { city: area.city })}</p>
          <p className="mt-4 text-base leading-relaxed text-slate-700">{t("areaCityBodyTwo", { city: area.city })}</p>
        </div>
      </section>
    </main>
  );
}
