"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";

const LOCALES = [
  { code: "en", label: "EN" },
  { code: "pt", label: "PT" },
  { code: "es", label: "ES" }
] as const;

export function LanguageSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div className="inline-flex items-center gap-1 rounded-full border border-theme bg-theme-surface p-1">
      {LOCALES.map((option) => {
        const active = locale === option.code;

        return (
          <button
            key={option.code}
            type="button"
            aria-label="Change language"
            onClick={() => router.replace(pathname, { locale: option.code })}
            className={
              active
                ? "rounded-full bg-theme-primary px-3 py-1 text-xs font-semibold text-white"
                : "rounded-full px-3 py-1 text-xs font-semibold text-theme-soft transition-colors hover:bg-theme-surface-soft"
            }
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
