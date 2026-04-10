"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAdminI18n } from "@/components/admin/layout/AdminI18nProvider";
import {
  IconDashboard,
  IconUsers,
  IconEdit,
  IconImage,
  IconBarChart,
  IconTag,
  IconSettings
} from "@/components/admin/shared/AdminIcons";
import type { ComponentType, SVGProps } from "react";

type IconComponent = ComponentType<SVGProps<SVGSVGElement> & { size?: number }>;

const ADMIN_NAV_ITEMS: readonly { href: string; labelKey: string; Icon: IconComponent }[] = [
  { href: "/admin", labelKey: "sidebar.nav.dashboard", Icon: IconDashboard },
  { href: "/admin/leads", labelKey: "sidebar.nav.leads", Icon: IconUsers },
  { href: "/admin/blog", labelKey: "sidebar.nav.blog", Icon: IconEdit },
  { href: "/admin/gallery", labelKey: "sidebar.nav.gallery", Icon: IconImage },
  { href: "/admin/analytics", labelKey: "sidebar.nav.analytics", Icon: IconBarChart },
  { href: "/admin/pixels", labelKey: "sidebar.nav.pixels", Icon: IconTag },
  { href: "/admin/settings", labelKey: "sidebar.nav.settings", Icon: IconSettings }
];

export function AdminSidebar() {
  const pathname = usePathname();
  const { t } = useAdminI18n();

  return (
    <aside className="flex flex-col rounded-2xl border border-slate-200 bg-white shadow-sm">
      {/* Logo */}
      <div className="flex items-center gap-3 border-b border-slate-100 px-4 py-4">
        <img
          src="/logo/logomcs.png"
          alt="Master Coat Solutions"
          className="h-9 w-auto"
        />
        <div className="min-w-0">
          <p className="truncate text-sm font-bold text-slate-900">MCS Admin</p>
          <p className="text-[10px] font-medium uppercase tracking-wider text-slate-400">{t("shell.badge")}</p>
        </div>
      </div>

      {/* Navigation */}
      <nav aria-label={t("sidebar.navLabel")} className="flex-1 px-3 py-3">
        <div className="grid gap-0.5">
          {ADMIN_NAV_ITEMS.map((item) => {
            const active = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition ${
                  active
                    ? "bg-slate-900 text-white shadow-sm"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <item.Icon size={16} className="flex-shrink-0" />
                {t(item.labelKey)}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Footer */}
      <div className="border-t border-slate-100 px-4 py-3">
        <p className="text-center text-[10px] text-slate-400">Powered by Innexar</p>
      </div>
    </aside>
  );
}
