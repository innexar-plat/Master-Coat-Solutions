import { redirect } from "next/navigation";
import { cookies, headers } from "next/headers";
import { PendingFollowUpsCard } from "@/components/admin/features/PendingFollowUpsCard";
import { PendingFollowUpsList } from "@/components/admin/features/PendingFollowUpsList";
import { AdminPanelShell } from "@/components/admin/layout/AdminPanelShell";
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
      <div className="grid gap-4 md:grid-cols-3">
        <article className="rounded-2xl border border-slate-200 bg-white p-5">
          <p className="text-xs uppercase tracking-wide text-slate-500">{t("dashboard.leadsToday")}</p>
          <p className="mt-2 text-3xl font-black text-slate-900">{metrics.leadsToday}</p>
        </article>
        <article className="rounded-2xl border border-slate-200 bg-white p-5">
          <p className="text-xs uppercase tracking-wide text-slate-500">{t("dashboard.conversionRate")}</p>
          <p className="mt-2 text-3xl font-black text-slate-900">{metrics.conversionRate}%</p>
        </article>
        <PendingFollowUpsCard />
      </div>

      <div className="flex flex-wrap gap-2 rounded-2xl border border-slate-200 bg-white p-4">
        <a
          href="/admin/leads"
          className="inline-flex rounded-full bg-slate-900 px-5 py-2 text-xs font-semibold text-white transition hover:bg-slate-700"
        >
          {t("dashboard.openLeads")}
        </a>
        <a
          href="/admin/analytics"
          className="inline-flex rounded-full border border-slate-300 bg-white px-5 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-100"
        >
          {t("dashboard.openAnalytics")}
        </a>
        <a
          href="/admin/pixels"
          className="inline-flex rounded-full border border-slate-300 bg-white px-5 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-100"
        >
          {t("dashboard.openPixels")}
        </a>
        <a
          href="/admin/blog"
          className="inline-flex rounded-full border border-slate-300 bg-white px-5 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-100"
        >
          {t("dashboard.openBlog")}
        </a>
        <a
          href="/admin/gallery"
          className="inline-flex rounded-full border border-slate-300 bg-white px-5 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-100"
        >
          {t("dashboard.openGallery")}
        </a>
      </div>

      <PendingFollowUpsList />
    </AdminPanelShell>
  );
}
