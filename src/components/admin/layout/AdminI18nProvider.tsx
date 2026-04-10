"use client";

import { createContext, useContext } from "react";
import { type AdminLocale, getAdminMessages, getAdminText } from "@/modules/admin/i18n/admin-i18n";

type AdminI18nContextValue = {
  locale: AdminLocale;
  t: (key: string) => string;
};

const AdminI18nContext = createContext<AdminI18nContextValue>({
  locale: "en",
  t: (key) => getAdminMessages("en")[key] ?? key
});

export function AdminI18nProvider({ locale, children }: { locale: AdminLocale; children: React.ReactNode }) {
  return (
    <AdminI18nContext.Provider
      value={{
        locale,
        t: (key: string) => getAdminText(locale, key)
      }}
    >
      {children}
    </AdminI18nContext.Provider>
  );
}

export function useAdminI18n() {
  return useContext(AdminI18nContext);
}