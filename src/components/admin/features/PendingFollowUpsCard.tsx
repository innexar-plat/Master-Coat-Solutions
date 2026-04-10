"use client";

import { useEffect, useState } from "react";
import { useAdminI18n } from "@/components/admin/layout/AdminI18nProvider";
import { IconClock } from "@/components/admin/shared/AdminIcons";

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
    <article className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
        <IconClock size={20} />
      </span>
      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{t("pending.card")}</p>
        <p className="mt-0.5 text-2xl font-bold text-slate-900">{count}</p>
      </div>
    </article>
  );
}
