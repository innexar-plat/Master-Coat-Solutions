import { cookies, headers } from "next/headers";
import { AdminI18nProvider } from "@/components/admin/layout/AdminI18nProvider";
import { AdminLocaleSwitcher } from "@/components/admin/layout/AdminLocaleSwitcher";
import { AdminLoginForm } from "@/components/admin/features/AdminLoginForm";
import { getAdminLocaleFromRequest, getAdminText } from "@/modules/admin/i18n/admin-i18n";

export default function AdminLoginPage() {
  const locale = getAdminLocaleFromRequest(cookies(), headers());

  return (
    <AdminI18nProvider locale={locale}>
      <main className="min-h-screen bg-[linear-gradient(180deg,#f8fafc,#eef2ff)]">
        <div className="mx-auto flex max-w-md justify-end px-4 pt-6">
          <AdminLocaleSwitcher />
        </div>
        <AdminLoginForm
          title={getAdminText(locale, "auth.loginTitle")}
          submitLabel={getAdminText(locale, "auth.signIn")}
          emailLabel={getAdminText(locale, "auth.email")}
          passwordLabel={getAdminText(locale, "auth.password")}
          errorLabel={getAdminText(locale, "auth.invalidCredentials")}
        />
      </main>
    </AdminI18nProvider>
  );
}
