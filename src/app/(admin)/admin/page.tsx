import { redirect } from "next/navigation";
import { cookies, headers } from "next/headers";
import { PendingFollowUpsCard } from "@/components/admin/features/PendingFollowUpsCard";
import { PendingFollowUpsList } from "@/components/admin/features/PendingFollowUpsList";
import { AdminPanelShell } from "@/components/admin/layout/AdminPanelShell";
import { IconUsers, IconTrendingUp, IconBarChart, IconTag, IconEdit, IconImage } from "@/components/admin/shared/AdminIcons";
import { getAdminLocaleFromRequest, getAdminText } from "@/modules/admin/i18n/admin-i18n";
import { ADMIN_SESSION_COOKIE } from "@/modules/auth/services/auth.constants";
import { verifyAdminSessionToken } from "@/modules/auth/services/admin-session.service";
import { buildDashboardMetrics } from "@/modules/leads/services/lead-dashboard-metrics.service";

export default async function AdminDashboardPage() {
  const token = cookies().get(ADMIN_SESSION_COOKIE)?.value;
  const session = token ? verifyAdminSessionToken(token) : { valid: false };

  if (!session.valid) {
    redirect("/admin/login");
  }

  const metrics = await buildDashboardMetrics();
  const locale = getAdminLocaleFromRequest(cookies(), headers());
  const t = (key: string) => getAdminText(locale, key);

  return (
    <AdminPanelShell
      locale={locale}
      title={t("dashboard.title")}
      description={t("dashboard.description")}
    >
      {/* Metrics row */}
      <div className="grid gap-4 sm:grid-cols-3">
        <article className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600"><IconUsers size={20} /></span>
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{t("dashboard.leadsToday")}</p>
            <p className="mt-0.5 text-2xl font-bold text-slate-900">{metrics.leadsToday}</p>
          </div>
        </article>
        <article className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600"><IconTrendingUp size={20} /></span>
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{t("dashboard.conversionRate")}</p>
            <p className="mt-0.5 text-2xl font-bold text-slate-900">{metrics.conversionRate}%</p>
          </div>
        </article>
        <PendingFollowUpsCard />
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
        {[
          { href: "/admin/leads", labelKey: "dashboard.openLeads", Icon: IconUsers, color: "text-blue-600" },
          { href: "/admin/analytics", labelKey: "dashboard.openAnalytics", Icon: IconBarChart, color: "text-indigo-600" },
          { href: "/admin/pixels", labelKey: "dashboard.openPixels", Icon: IconTag, color: "text-slate-600" },
          { href: "/admin/blog", labelKey: "dashboard.openBlog", Icon: IconEdit, color: "text-emerald-600" },
          { href: "/admin/gallery", labelKey: "dashboard.openGallery", Icon: IconImage, color: "text-amber-600" }
        ].map((link) => (
          <a
            key={link.href}
            href={link.href}
            className="flex flex-col items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-3 text-center text-xs font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 hover:shadow-sm"
          >
            <link.Icon size={22} className={link.color} />
            {t(link.labelKey)}
          </a>
        ))}
      </div>

      <PendingFollowUpsList />
    </AdminPanelShell>
  );
}
