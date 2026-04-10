import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { routing } from "@/i18n/routing";

type SiteHeaderProps = {
  locale?: string;
};

export function SiteHeader({ locale }: SiteHeaderProps) {
  const t = useTranslations("Home");
  const activeLocale = locale && routing.locales.includes(locale as "en" | "pt" | "es") ? locale : undefined;

  return (
    <header className="sticky top-0 z-30 border-b border-theme/70 bg-[color:color-mix(in_srgb,var(--theme-primary)_8%,white)]/65 backdrop-blur-xl backdrop-saturate-150">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-3 md:px-6">
        <div className="flex items-center gap-3">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-theme-primary text-xs font-black text-white">MC</span>
          <strong className="text-lg font-black tracking-tight text-theme-secondary">Master Coat Solutions</strong>
        </div>
        <nav className="hidden items-center gap-6 text-sm font-medium text-theme-soft md:flex">
          <Link className="transition-colors hover:text-theme-secondary" href="/" locale={activeLocale}>{t("navHome")}</Link>
          <Link className="transition-colors hover:text-theme-secondary" href="/services" locale={activeLocale}>{t("navServices")}</Link>
          <Link className="transition-colors hover:text-theme-secondary" href="/gallery" locale={activeLocale}>{t("navGallery")}</Link>
          <Link className="transition-colors hover:text-theme-secondary" href="/blog" locale={activeLocale}>{t("navBlog")}</Link>
          <Link className="transition-colors hover:text-theme-secondary" href="/contact" locale={activeLocale}>{t("navContact")}</Link>
        </nav>
        <LanguageSwitcher />
      </div>
    </header>
  );
}
