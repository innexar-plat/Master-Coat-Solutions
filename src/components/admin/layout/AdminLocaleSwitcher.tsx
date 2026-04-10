"use client";

import { useState } from "react";
import { ADMIN_LOCALES, type AdminLocale } from "@/modules/admin/i18n/admin-i18n";
import { useAdminI18n } from "@/components/admin/layout/AdminI18nProvider";

export function AdminLocaleSwitcher() {
  const { locale, t } = useAdminI18n();
  const [loadingLocale, setLoadingLocale] = useState<AdminLocale | null>(null);

  async function changeLocale(nextLocale: AdminLocale) {
    if (nextLocale === locale) {
      return;
    }

    setLoadingLocale(nextLocale);

    try {
      await fetch("/api/admin/locale", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ locale: nextLocale })
      });
      window.location.reload();
    } finally {
      setLoadingLocale(null);
    }
  }

  return (
    <div className="flex items-center gap-2">
      {ADMIN_LOCALES.map((entry) => {
        const active = entry === locale;

        return (
          <button
            key={entry}
            type="button"
            onClick={() => changeLocale(entry)}
            disabled={loadingLocale === entry}
            className={`rounded-full px-3 py-2 text-xs font-semibold transition ${
              active ? "bg-slate-900 text-white" : "border border-slate-300 bg-white text-slate-700 hover:bg-slate-100"
            }`}
            aria-label={t(`locale.${entry}`)}
          >
            {entry.toUpperCase()}
          </button>
        );
      })}
    </div>
  );
}