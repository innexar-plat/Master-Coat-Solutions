"use client";

import { useEffect, useState } from "react";
import { useAdminI18n } from "@/components/admin/layout/AdminI18nProvider";
import { IconBarChart, IconFileText, IconMail, IconCursorClick } from "@/components/admin/shared/AdminIcons";
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
    <div className="grid gap-5">
      {/* Metrics row */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <article className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600"><IconBarChart size={20} /></span>
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{t("analytics.totalEvents")}</p>
            <p className="mt-0.5 text-2xl font-bold text-slate-900">{summary.totalEvents}</p>
          </div>
        </article>
        <article className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600"><IconFileText size={20} /></span>
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{t("analytics.uniquePages")}</p>
            <p className="mt-0.5 text-2xl font-bold text-slate-900">{summary.uniquePages}</p>
          </div>
        </article>
        <article className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600"><IconMail size={20} /></span>
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{t("analytics.leadSubmit")}</p>
            <p className="mt-0.5 text-2xl font-bold text-slate-900">{summary.eventsByName.LEAD_SUBMIT ?? 0}</p>
          </div>
        </article>
        <article className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-50 text-amber-600"><IconCursorClick size={20} /></span>
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{t("analytics.ctaClick")}</p>
            <p className="mt-0.5 text-2xl font-bold text-slate-900">{summary.eventsByName.CTA_CLICK ?? 0}</p>
          </div>
        </article>
      </section>

      {/* Top pages */}
      <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 px-5 py-3.5">
          <h2 className="text-base font-bold text-slate-900">{t("analytics.topPages")}</h2>
        </div>
        <div className="px-5 py-3">
          {summary.topPages.length === 0 ? (
            <p className="py-3 text-sm text-slate-500">{t("analytics.empty")}</p>
          ) : (
            <ul className="divide-y divide-slate-50 text-sm">
              {summary.topPages.map((item, index) => (
                <li key={item.pagePath} className="flex items-center justify-between py-2">
                  <span className="flex items-center gap-2.5 text-slate-700">
                    <span className="flex h-6 w-6 items-center justify-center rounded-md bg-slate-100 text-[10px] font-bold text-slate-500">{index + 1}</span>
                    <span className="font-medium">{item.pagePath}</span>
                  </span>
                  <span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-600">{item.count}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </div>
  );
}
