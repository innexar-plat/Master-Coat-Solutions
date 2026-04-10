import { useTranslations } from "next-intl";
import { SiteHeader } from "@/components/shared/SiteHeader";
import { PageIntro } from "@/components/public/sections/PageIntro";
import { ContactPanel } from "@/components/public/features/ContactPanel";
import { HomeLeadCaptureForm } from "@/components/public/features/HomeLeadCaptureForm";

type ContactPageProps = {
  params: { locale: string };
};

function normalizeLocale(locale: string): "en" | "pt" | "es" {
  if (locale === "pt" || locale === "es") {
    return locale;
  }

  return "en";
}

export default function ContactPage({ params }: ContactPageProps) {
  const t = useTranslations("Pages");
  const home = useTranslations("Home");
  const locale = normalizeLocale(params.locale);

  return (
    <main className="min-h-screen">
      <SiteHeader locale={locale} />
      <PageIntro eyebrow={t("eyebrow")} title={t("contactTitle")} description={t("contactDescription")} />
      <HomeLeadCaptureForm
        locale={locale}
        title={home("contactBlockTitle")}
        description={home("contactBlockText")}
        ctaLabel={home("contactStrongCta")}
        placeholders={{
          name: home("contactPlaceholderName"),
          phone: home("contactPlaceholderPhone"),
          email: home("contactPlaceholderEmail"),
          details: home("contactPlaceholderDetails")
        }}
        serviceTypeLabel={home("contactServiceTypeLabel")}
        serviceTypePlaceholder={home("contactServiceTypePlaceholder")}
        serviceOptions={[
          { value: "interior-painting", label: home("contactServiceTypeInterior") },
          { value: "exterior-painting", label: home("contactServiceTypeExterior") },
          { value: "trim-and-detail", label: home("contactServiceTypeTrim") },
          { value: "cabinet-painting", label: home("contactServiceTypeCabinets") },
          { value: "full-home-repaint", label: home("contactServiceTypeFullRepaint") }
        ]}
        feedback={{
          success: home("contactFeedbackSuccess"),
          error: home("contactFeedbackError")
        }}
        validation={{
          nameRequired: home("contactValidationNameRequired"),
          phoneInvalid: home("contactValidationPhoneInvalid"),
          emailInvalid: home("contactValidationEmailInvalid"),
          serviceRequired: home("contactValidationServiceRequired")
        }}
      />
      <ContactPanel
        title={t("contactPanelTitle")}
        description={t("contactPanelDescription")}
        phone="(407) 555-1200"
        email="hello@vinipainting.com"
        address="Orlando, FL"
      />
    </main>
  );
}
