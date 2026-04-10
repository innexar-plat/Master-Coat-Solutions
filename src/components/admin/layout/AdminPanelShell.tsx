import type { ReactNode } from "react";
import { AdminLogoutButton } from "@/components/admin/features/AdminLogoutButton";
import { AdminI18nProvider } from "@/components/admin/layout/AdminI18nProvider";
import { AdminSidebar } from "@/components/admin/layout/AdminSidebar";
import { type AdminLocale } from "@/modules/admin/i18n/admin-i18n";

type AdminPanelShellProps = {
  locale: AdminLocale;
  title: string;
  description: string;
  children: ReactNode;
};

export function AdminPanelShell({ locale, title, description, children }: AdminPanelShellProps) {
  return (
    <AdminI18nProvider locale={locale}>
      <main className="min-h-screen bg-slate-50 px-4 py-6 md:px-6">
        <div className="mx-auto grid w-full max-w-7xl gap-5 lg:grid-cols-[240px_minmax(0,1fr)]">
          <AdminSidebar />

          <section className="min-w-0 space-y-5">
            <header className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
              <div className="min-w-0">
                <h1 className="text-xl font-bold tracking-tight text-slate-900">{title}</h1>
                <p className="mt-0.5 text-sm text-slate-500">{description}</p>
              </div>
              <AdminLogoutButton />
            </header>

            {children}
          </section>
        </div>
      </main>
    </AdminI18nProvider>
  );
}
