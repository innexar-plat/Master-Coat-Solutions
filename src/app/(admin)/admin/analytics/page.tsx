import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { AdminAnalyticsOverview } from "@/components/admin/features/AdminAnalyticsOverview";
import { AdminPanelShell } from "@/components/admin/layout/AdminPanelShell";
import { getAdminLocaleFromRequest, getAdminText } from "@/modules/admin/i18n/admin-i18n";
import { ADMIN_SESSION_COOKIE } from "@/modules/auth/services/auth.constants";
import { verifyAdminSessionToken } from "@/modules/auth/services/admin-session.service";

export default function AdminAnalyticsPage() {
  const token = cookies().get(ADMIN_SESSION_COOKIE)?.value;
  const session = token ? verifyAdminSessionToken(token) : { valid: false };

  if (!session.valid) {
    redirect("/admin/login");
  }

  const locale = getAdminLocaleFromRequest(cookies(), headers());

  return (
    <AdminPanelShell
      locale={locale}
      title={getAdminText(locale, "analytics.title")}
      description={getAdminText(locale, "analytics.description")}
    >
      <AdminAnalyticsOverview />
    </AdminPanelShell>
  );
}
