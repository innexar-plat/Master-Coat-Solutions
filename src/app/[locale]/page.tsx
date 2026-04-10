import { useTranslations } from "next-intl";
import type { CSSProperties } from "react";
import Image from "next/image";
import { ServiceShowcaseCard } from "@/components/ui/ServiceShowcaseCard";
import { SiteHeader } from "@/components/shared/SiteHeader";
import { BeforeAfterShowcase } from "@/components/public/features/BeforeAfterShowcase";
import { TestimonialStrip } from "@/components/public/features/TestimonialStrip";
import { MobileStickyCta } from "@/components/public/features/MobileStickyCta";
import { HeroPaintCanvas } from "@/components/public/features/HeroPaintCanvas";
import { Link } from "@/i18n/navigation";
import { HomeLeadCaptureForm } from "@/components/public/features/HomeLeadCaptureForm";

const HERO_IMAGE_URL = "/images/placeholders/hero-painting.webp";
const INTERIOR_IMAGE_URL = "/images/placeholders/interior-painting.jpg";
const EXTERIOR_IMAGE_URL = "/images/placeholders/exterior-painting.jpeg";
const DETAIL_IMAGE_URL = "/images/placeholders/trim-detail-finishes.jpg";

type HomePageProps = {
  params: { locale: string };
};

export default function HomePage({ params }: HomePageProps) {
  const t = useTranslations("Home");
  const locale = params.locale;
  const heroWords = t("heroTitle").split(" ").filter(Boolean);

  return (
    <main className="min-h-screen">
      <SiteHeader locale={locale} />

      <section className="hero-atelier">
        <HeroPaintCanvas />

        <svg className="hero-smear hero-smear-1" width="180" height="60" viewBox="0 0 180 60" aria-hidden>
          <path d="M4 38 Q40 10 90 28 Q140 46 176 22" stroke="#E8524A" strokeWidth="18" fill="none" strokeLinecap="round" opacity=".18" />
          <path d="M10 44 Q50 20 95 34 Q142 50 174 30" stroke="#E8524A" strokeWidth="7" fill="none" strokeLinecap="round" opacity=".3" />
        </svg>
        <svg className="hero-smear hero-smear-2" width="140" height="48" viewBox="0 0 140 48" aria-hidden>
          <path d="M4 30 Q35 8 70 22 Q105 36 136 18" stroke="#2962d4" strokeWidth="14" fill="none" strokeLinecap="round" opacity=".15" />
        </svg>
        <svg className="hero-smear hero-smear-3" width="100" height="40" viewBox="0 0 100 40" aria-hidden>
          <path d="M3 25 Q25 8 50 18 Q75 28 97 14" stroke="#f5c800" strokeWidth="20" fill="none" strokeLinecap="round" opacity=".3" />
        </svg>

        <div className="hero-body-atelier mx-auto w-full max-w-6xl px-4 md:px-6">
          <div className="hero-eyebrow">
            <span className="hero-eyebrow-line" />
            <span className="hero-eyebrow-text">{t("heroEyebrow")}</span>
          </div>

          <h1 className="hero-headline-atelier">
            {heroWords.map((word, index) => (
              <span
                key={`${word}-${index}`}
                className="hero-paint-word"
                style={{ "--word-delay": `${index * 95}ms` } as CSSProperties}
              >
                {word}
              </span>
            ))}
          </h1>

          <div className="hero-bottom-atelier">
            <p className="hero-desc-atelier">{t("heroSubtitle")}</p>
            <div className="hero-actions-atelier">
              <Link href="/free-estimate" locale={locale} className="hero-btn-primary">
                {t("primaryCta")}
              </Link>
              <Link href="/gallery" locale={locale} className="hero-btn-secondary">
                {t("secondaryCta")}
              </Link>
            </div>
          </div>

          <div className="mt-8 max-w-4xl">
            <Image
              src={HERO_IMAGE_URL}
              alt="Professional painter applying a premium coat"
              width={1600}
              height={900}
              className="h-56 w-full rounded-3xl border border-theme object-cover shadow-card md:h-72"
              priority
            />
          </div>
        </div>

        <div className="hero-stats-strip mx-auto w-full max-w-6xl md:px-6">
          <div className="hero-stat">
            <span className="hero-stat-num">{t("statOneValue")}</span>
            <span className="hero-stat-label">{t("statOneLabel")}</span>
          </div>
          <div className="hero-stat">
            <span className="hero-stat-num">{t("statTwoValue")}</span>
            <span className="hero-stat-label">{t("statTwoLabel")}</span>
          </div>
          <div className="hero-stat">
            <span className="hero-stat-num">{t("statThreeValue")}</span>
            <span className="hero-stat-label">{t("statThreeLabel")}</span>
          </div>
          <div className="hero-stat">
            <span className="hero-stat-num">{t("statFourValue")}</span>
            <span className="hero-stat-label">{t("statFourLabel")}</span>
          </div>
        </div>
      </section>

      <section id="services" className="mx-auto w-full max-w-6xl px-4 pb-16 md:px-6">
        <h2 className="mb-6 text-3xl font-black tracking-tight text-theme-secondary">{t("servicesTitle")}</h2>
        <div className="grid gap-5 md:grid-cols-3">
          <ServiceShowcaseCard title={t("serviceOneTitle")} description={t("serviceOneDesc")} imageUrl={INTERIOR_IMAGE_URL} ctaLabel={t("primaryCta")} href="/services/interior-painting" locale={locale} />
          <ServiceShowcaseCard title={t("serviceTwoTitle")} description={t("serviceTwoDesc")} imageUrl={EXTERIOR_IMAGE_URL} ctaLabel={t("primaryCta")} href="/services/exterior-painting" locale={locale} />
          <ServiceShowcaseCard title={t("serviceThreeTitle")} description={t("serviceThreeDesc")} imageUrl={DETAIL_IMAGE_URL} ctaLabel={t("primaryCta")} href="/services/trim-and-detail-finishes" locale={locale} />
        </div>
      </section>

      <BeforeAfterShowcase
        title={t("beforeAfterTitle")}
        beforeLabel={t("beforeLabel")}
        afterLabel={t("afterLabel")}
      />

      <TestimonialStrip
        title={t("testimonialsTitle")}
        items={[
          { quote: t("testimonialOneQuote"), author: t("testimonialOneAuthor"), city: t("testimonialOneCity") },
          { quote: t("testimonialTwoQuote"), author: t("testimonialTwoAuthor"), city: t("testimonialTwoCity") },
          {
            quote: t("testimonialThreeQuote"),
            author: t("testimonialThreeAuthor"),
            city: t("testimonialThreeCity")
          }
        ]}
      />

      <HomeLeadCaptureForm
        locale={locale as "en" | "pt" | "es"}
        title={t("contactBlockTitle")}
        description={t("contactBlockText")}
        ctaLabel={t("contactStrongCta")}
        placeholders={{
          name: t("contactPlaceholderName"),
          phone: t("contactPlaceholderPhone"),
          email: t("contactPlaceholderEmail"),
          details: t("contactPlaceholderDetails")
        }}
        serviceTypeLabel={t("contactServiceTypeLabel")}
        serviceTypePlaceholder={t("contactServiceTypePlaceholder")}
        serviceOptions={[
          { value: "interior-painting", label: t("contactServiceTypeInterior") },
          { value: "exterior-painting", label: t("contactServiceTypeExterior") },
          { value: "trim-and-detail", label: t("contactServiceTypeTrim") },
          { value: "cabinet-painting", label: t("contactServiceTypeCabinets") },
          { value: "full-home-repaint", label: t("contactServiceTypeFullRepaint") }
        ]}
        feedback={{
          success: t("contactFeedbackSuccess"),
          error: t("contactFeedbackError")
        }}
        validation={{
          nameRequired: t("contactValidationNameRequired"),
          phoneInvalid: t("contactValidationPhoneInvalid"),
          emailInvalid: t("contactValidationEmailInvalid"),
          serviceRequired: t("contactValidationServiceRequired")
        }}
      />

      <MobileStickyCta label={t("primaryCta")} />
    </main>
  );
}
