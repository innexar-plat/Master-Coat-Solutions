"use client";

import { useEffect, useState } from "react";
import { useAdminI18n } from "@/components/admin/layout/AdminI18nProvider";

type PendingFollowUpsResponse = {
  data: {
    pendingCount: number;
  };
};

export function PendingFollowUpsCard() {
  const { t } = useAdminI18n();
  const [count, setCount] = useState(0);

  useEffect(() => {
    let mounted = true;

    async function loadPendingCount() {
      const response = await fetch("/api/admin/follow-ups/pending-count");
      if (!response.ok) {
        return;
      }

      const json = (await response.json()) as PendingFollowUpsResponse;
      if (mounted) {
        setCount(json.data.pendingCount);
      }
    }

    loadPendingCount();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5">
      <p className="text-xs uppercase tracking-wide text-slate-500">{t("pending.card")}</p>
      <p className="mt-2 text-3xl font-black text-slate-900">{count}</p>
    </article>
  );
}
