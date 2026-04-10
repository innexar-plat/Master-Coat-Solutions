import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { AdminGalleryManager } from "@/components/admin/features/AdminGalleryManager";
import { AdminPanelShell } from "@/components/admin/layout/AdminPanelShell";
import { getAdminLocaleFromRequest, getAdminText } from "@/modules/admin/i18n/admin-i18n";
import { ADMIN_SESSION_COOKIE } from "@/modules/auth/services/auth.constants";
import { verifyAdminSessionToken } from "@/modules/auth/services/admin-session.service";
import { readGalleryContent } from "@/modules/gallery/services/gallery-storage.service";

export default async function AdminGalleryPage() {
  const token = cookies().get(ADMIN_SESSION_COOKIE)?.value;
  const session = token ? verifyAdminSessionToken(token) : { valid: false };

  if (!session.valid) {
    redirect("/admin/login");
  }

  const content = await readGalleryContent();
  const locale = getAdminLocaleFromRequest(cookies(), headers());

  return (
    <AdminPanelShell
      locale={locale}
      title={getAdminText(locale, "gallery.title")}
      description={getAdminText(locale, "gallery.description")}
    >
      <AdminGalleryManager initialContent={content} />
    </AdminPanelShell>
  );
}
