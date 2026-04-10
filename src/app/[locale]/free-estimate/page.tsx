import { useTranslations } from "next-intl";
import { SiteHeader } from "@/components/shared/SiteHeader";
import { PageIntro } from "@/components/public/sections/PageIntro";
import { EstimateFormPreview } from "@/components/public/features/EstimateFormPreview";

type FreeEstimatePageProps = {
  params: { locale: string };
};

export default function FreeEstimatePage({ params }: FreeEstimatePageProps) {
  const t = useTranslations("Pages");
  const locale = (params.locale === "pt" || params.locale === "es" ? params.locale : "en") as
    | "en"
    | "pt"
    | "es";

  return (
    <main className="min-h-screen">
      <SiteHeader />
      <PageIntro
        eyebrow={t("eyebrow")}
        title={t("estimateTitle")}
        description={t("estimateDescription")}
      />
      <EstimateFormPreview
        title={t("estimateFormTitle")}
        ctaLabel={t("estimateCta")}
        locale={locale}
        placeholders={{
          name: t("estimatePlaceholderName"),
          phone: t("estimatePlaceholderPhone"),
          email: t("estimatePlaceholderEmail"),
          service: t("estimatePlaceholderService"),
          details: t("estimatePlaceholderDetails")
        }}
        feedback={{
          success: t("estimateFeedbackSuccess"),
          error: t("estimateFeedbackError")
        }}
      />
    </main>
  );
}
