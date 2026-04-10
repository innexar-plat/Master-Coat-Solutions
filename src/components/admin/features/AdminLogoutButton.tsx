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
      className="rounded-full border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-100"
    >
      {t("auth.logout")}
    </button>
  );
}
