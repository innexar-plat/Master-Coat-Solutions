import type { ReactNode } from "react";
import { AdminLogoutButton } from "@/components/admin/features/AdminLogoutButton";
import { AdminI18nProvider } from "@/components/admin/layout/AdminI18nProvider";
import { AdminLocaleSwitcher } from "@/components/admin/layout/AdminLocaleSwitcher";
import { AdminSidebar } from "@/components/admin/layout/AdminSidebar";
import { getAdminText, type AdminLocale } from "@/modules/admin/i18n/admin-i18n";

type AdminPanelShellProps = {
  locale: AdminLocale;
  title: string;
  description: string;
  children: ReactNode;
};

export function AdminPanelShell({ locale, title, description, children }: AdminPanelShellProps) {
  return (
    <AdminI18nProvider locale={locale}>
      <main className="min-h-screen bg-slate-50 px-4 py-8 md:px-6">
        <div className="mx-auto grid w-full max-w-7xl gap-6 lg:grid-cols-[260px_minmax(0,1fr)]">
          <AdminSidebar />

          <section className="min-w-0 space-y-6">
            <header className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-700">{getAdminText(locale, "shell.badge")}</p>
                  <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-900">{title}</h1>
                  <p className="mt-2 text-sm text-slate-600">{description}</p>
                </div>
                <div className="flex items-center gap-2">
                  <AdminLocaleSwitcher />
                  <AdminLogoutButton />
                </div>
              </div>
            </header>

            {children}
          </section>
        </div>
      </main>
    </AdminI18nProvider>
  );
}
