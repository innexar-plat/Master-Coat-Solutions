import { useTranslations } from "next-intl";
import { SiteHeader } from "@/components/shared/SiteHeader";
import { PageIntro } from "@/components/public/sections/PageIntro";
import { FaqList } from "@/components/public/features/FaqList";

export default function FaqPage() {
  const t = useTranslations("Pages");

  return (
    <main className="min-h-screen">
      <SiteHeader />
      <PageIntro eyebrow={t("eyebrow")} title={t("faqTitle")} description={t("faqDescription")} />
      <FaqList
        title={t("faqListTitle")}
        items={[
          { question: t("faqOneQuestion"), answer: t("faqOneAnswer") },
          { question: t("faqTwoQuestion"), answer: t("faqTwoAnswer") },
          { question: t("faqThreeQuestion"), answer: t("faqThreeAnswer") }
        ]}
      />
    </main>
  );
}
