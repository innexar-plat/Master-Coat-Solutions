import { redirect } from "next/navigation";
import { cookies, headers } from "next/headers";
import { ADMIN_SESSION_COOKIE } from "@/modules/auth/services/auth.constants";
import { verifyAdminSessionToken } from "@/modules/auth/services/admin-session.service";
import { AdminLeadsWorkspace } from "@/components/admin/features/AdminLeadsWorkspace";
import { AdminPanelShell } from "@/components/admin/layout/AdminPanelShell";
import { getAdminLocaleFromRequest, getAdminText } from "@/modules/admin/i18n/admin-i18n";

export default function AdminLeadsPage() {
  const token = cookies().get(ADMIN_SESSION_COOKIE)?.value;
  const session = token ? verifyAdminSessionToken(token) : { valid: false };

  if (!session.valid) {
    redirect("/admin/login");
  }

  const locale = getAdminLocaleFromRequest(cookies(), headers());

  return (
    <AdminPanelShell
      locale={locale}
      title={getAdminText(locale, "leads.title")}
      description={getAdminText(locale, "leads.description")}
    >
      <AdminLeadsWorkspace />
    </AdminPanelShell>
  );
}
