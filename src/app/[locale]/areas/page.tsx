import { useTranslations } from "next-intl";
import { SiteHeader } from "@/components/shared/SiteHeader";
import { PageIntro } from "@/components/public/sections/PageIntro";
import { ServiceAreasGrid } from "@/components/public/features/ServiceAreasGrid";
import { listServiceAreas } from "@/modules/areas/data/service-areas.data";

type AreasPageProps = {
  params: {
    locale: "en" | "pt" | "es";
  };
};

export default function AreasPage({ params }: AreasPageProps) {
  const t = useTranslations("Pages");
  const areas = listServiceAreas(params.locale);

  return (
    <main className="min-h-screen">
      <SiteHeader />
      <PageIntro eyebrow={t("eyebrow")} title={t("areasTitle")} description={t("areasDescription")} />
      <ServiceAreasGrid title={t("areasGridTitle")} ctaLabel={t("areasCta")} areas={areas} />
    </main>
  );
}
