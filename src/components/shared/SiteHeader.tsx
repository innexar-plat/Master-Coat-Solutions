import { useTranslations } from "next-intl";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { routing } from "@/i18n/routing";

type SiteHeaderProps = {
  locale?: string;
};

export function SiteHeader({ locale }: SiteHeaderProps) {
  const t = useTranslations("Home");
  const activeLocale = locale && routing.locales.includes(locale as "en" | "pt" | "es") ? locale : undefined;
  const callLabel = "Call Now";
  const callNumber = "(407) 555-1200";
  const callHref = "tel:+14075551200";

  return (
    <header className="sticky top-0 z-30 border-b border-theme/70 bg-[color:color-mix(in_srgb,var(--theme-primary)_8%,white)]/65 backdrop-blur-xl backdrop-saturate-150">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-3 md:px-6">
        <Link href="/" locale={activeLocale} className="inline-flex items-center" aria-label="Master Coat Solutions">
          <Image
            src="/logo/logomcs.png"
            alt="Master Coat Solutions"
            width={699}
            height={400}
            priority
            className="h-[68px] w-auto md:h-[82px]"
          />
        </Link>
        <nav className="hidden items-center gap-6 text-sm font-medium text-theme-soft md:flex">
          <Link className="transition-colors hover:text-theme-secondary" href="/" locale={activeLocale}>{t("navHome")}</Link>
          <Link className="transition-colors hover:text-theme-secondary" href="/services" locale={activeLocale}>{t("navServices")}</Link>
          <Link className="transition-colors hover:text-theme-secondary" href="/gallery" locale={activeLocale}>{t("navGallery")}</Link>
          <Link className="transition-colors hover:text-theme-secondary" href="/blog" locale={activeLocale}>{t("navBlog")}</Link>
          <Link className="transition-colors hover:text-theme-secondary" href="/contact" locale={activeLocale}>{t("navContact")}</Link>
        </nav>
        <div className="flex items-center gap-2">
          <a
            href={callHref}
            aria-label={`${callLabel} ${callNumber}`}
            className="inline-flex items-center rounded-full bg-theme-primary-strong px-3 py-2 text-xs font-extrabold uppercase tracking-wide text-white shadow-[0_10px_22px_-12px_rgba(15,23,42,0.85)] transition hover:bg-theme-primary hover:brightness-110 md:px-4"
          >
            <span className="md:hidden">{callLabel}</span>
            <span className="hidden md:inline">{callLabel}: {callNumber}</span>
          </a>
          <LanguageSwitcher />
        </div>
      </div>
    </header>
  );
}
