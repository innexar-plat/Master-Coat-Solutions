"use client";

import { useAdminI18n } from "@/components/admin/layout/AdminI18nProvider";

export function AdminLogoutButton() {
  const { t } = useAdminI18n();

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    window.location.href = "/admin/login";
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      className="rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:bg-slate-50"
    >
      {t("auth.logout")}
    </button>
  );
}
