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
    <div className="flex items-center gap-1">
      {ADMIN_LOCALES.map((entry) => {
        const active = entry === locale;

        return (
          <button
            key={entry}
            type="button"
            onClick={() => changeLocale(entry)}
            disabled={loadingLocale === entry}
            className={`rounded-md px-2 py-1 text-[11px] font-semibold transition ${
              active ? "bg-slate-900 text-white" : "text-slate-500 hover:bg-slate-100 hover:text-slate-700"
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