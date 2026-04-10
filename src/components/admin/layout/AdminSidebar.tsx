"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAdminI18n } from "@/components/admin/layout/AdminI18nProvider";

const ADMIN_NAV_ITEMS = [
  { href: "/admin", labelKey: "sidebar.nav.dashboard" },
  { href: "/admin/leads", labelKey: "sidebar.nav.leads" },
  { href: "/admin/blog", labelKey: "sidebar.nav.blog" },
  { href: "/admin/gallery", labelKey: "sidebar.nav.gallery" },
  { href: "/admin/analytics", labelKey: "sidebar.nav.analytics" },
  { href: "/admin/pixels", labelKey: "sidebar.nav.pixels" }
] as const;

export function AdminSidebar() {
  const pathname = usePathname();
  const { t } = useAdminI18n();

  return (
    <aside className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm md:p-5">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-700">{t("shell.badge")}</p>
      <h2 className="mt-2 text-lg font-black text-slate-900">{t("sidebar.title")}</h2>

      <nav aria-label={t("sidebar.navLabel")} className="mt-5 grid gap-2">
        {ADMIN_NAV_ITEMS.map((item) => {
          const active = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded-xl px-3 py-2 text-sm font-semibold transition ${
                active ? "bg-slate-900 text-white" : "text-slate-700 hover:bg-slate-100"
              }`}
            >
              {t(item.labelKey)}
            </Link>
          );
        })}
      </nav>

      <div className="mt-6 rounded-2xl bg-slate-50 p-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{t("sidebar.coverageTitle")}</p>
        <p className="mt-1 text-xs text-slate-700">
          {t("sidebar.coverageText")}
        </p>
      </div>
    </aside>
  );
}
