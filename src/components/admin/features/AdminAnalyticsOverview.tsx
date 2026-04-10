"use client";

import { useEffect, useState } from "react";
import { useAdminI18n } from "@/components/admin/layout/AdminI18nProvider";
import type { AnalyticsSummary } from "@/modules/analytics/dtos/track-event.dto";

const EMPTY_SUMMARY: AnalyticsSummary = {
  totalEvents: 0,
  uniquePages: 0,
  eventsByName: {},
  topPages: [],
  lastEventAt: null
};

export function AdminAnalyticsOverview() {
  const { t } = useAdminI18n();
  const [summary, setSummary] = useState<AnalyticsSummary>(EMPTY_SUMMARY);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");

  useEffect(() => {
    async function loadSummary() {
      try {
        const response = await fetch("/api/admin/analytics/summary?sinceDays=30");

        if (!response.ok) {
          throw new Error("Failed to load analytics summary");
        }

        const json = (await response.json()) as { data: AnalyticsSummary };
        setSummary(json.data);
        setStatus("ready");
      } catch {
        setStatus("error");
      }
    }

    loadSummary();
  }, []);

  if (status === "loading") {
    return <p className="text-sm text-slate-600">{t("analytics.loading")}</p>;
  }

  if (status === "error") {
    return <p className="text-sm font-medium text-red-700">{t("analytics.error")}</p>;
  }

  return (
    <div className="grid gap-6">
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <article className="rounded-2xl border border-slate-200 bg-white p-5">
          <p className="text-xs uppercase tracking-wide text-slate-500">{t("analytics.totalEvents")}</p>
          <p className="mt-2 text-3xl font-black text-slate-900">{summary.totalEvents}</p>
        </article>
        <article className="rounded-2xl border border-slate-200 bg-white p-5">
          <p className="text-xs uppercase tracking-wide text-slate-500">{t("analytics.uniquePages")}</p>
          <p className="mt-2 text-3xl font-black text-slate-900">{summary.uniquePages}</p>
        </article>
        <article className="rounded-2xl border border-slate-200 bg-white p-5">
          <p className="text-xs uppercase tracking-wide text-slate-500">{t("analytics.leadSubmit")}</p>
          <p className="mt-2 text-3xl font-black text-slate-900">{summary.eventsByName.LEAD_SUBMIT ?? 0}</p>
        </article>
        <article className="rounded-2xl border border-slate-200 bg-white p-5">
          <p className="text-xs uppercase tracking-wide text-slate-500">{t("analytics.ctaClick")}</p>
          <p className="mt-2 text-3xl font-black text-slate-900">{summary.eventsByName.CTA_CLICK ?? 0}</p>
        </article>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-5 md:p-6">
        <h2 className="text-lg font-bold tracking-tight text-slate-900">{t("analytics.topPages")}</h2>
        {summary.topPages.length === 0 ? (
          <p className="mt-3 text-sm text-slate-600">{t("analytics.empty")}</p>
        ) : (
          <ul className="mt-4 space-y-2 text-sm text-slate-700">
            {summary.topPages.map((item) => (
              <li key={item.pagePath} className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2">
                <span className="font-medium">{item.pagePath}</span>
                <span>{item.count}</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
