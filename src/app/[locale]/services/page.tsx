import { useTranslations } from "next-intl";
import { SiteHeader } from "@/components/shared/SiteHeader";
import { PageIntro } from "@/components/public/sections/PageIntro";
import { ServiceShowcaseCard } from "@/components/ui/ServiceShowcaseCard";

const INTERIOR_IMAGE_URL = "/images/placeholders/interior-painting.jpg";
const EXTERIOR_IMAGE_URL = "/images/placeholders/exterior-painting.jpeg";
const DETAIL_IMAGE_URL = "/images/placeholders/trim-detail-finishes.jpg";

export default function ServicesPage() {
  const t = useTranslations("Pages");

  return (
    <main className="min-h-screen">
      <SiteHeader />
      <PageIntro eyebrow={t("eyebrow")} title={t("servicesTitle")} description={t("servicesDescription")} />
      <section className="mx-auto w-full max-w-6xl px-4 pb-20 pt-10 md:px-6">
        <div className="grid gap-5 md:grid-cols-3">
          <ServiceShowcaseCard
            title={t("serviceOneTitle")}
            description={t("serviceOneDesc")}
            imageUrl={INTERIOR_IMAGE_URL}
            href="/services/interior-painting"
            ctaLabel={t("servicePageCta")}
          />
          <ServiceShowcaseCard
            title={t("serviceTwoTitle")}
            description={t("serviceTwoDesc")}
            imageUrl={EXTERIOR_IMAGE_URL}
            href="/services/exterior-painting"
            ctaLabel={t("servicePageCta")}
          />
          <ServiceShowcaseCard
            title={t("serviceThreeTitle")}
            description={t("serviceThreeDesc")}
            imageUrl={DETAIL_IMAGE_URL}
            href="/services/trim-and-detail-finishes"
            ctaLabel={t("servicePageCta")}
          />
        </div>
      </section>
    </main>
  );
}
