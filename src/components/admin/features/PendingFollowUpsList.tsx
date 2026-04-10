"use client";

import { useEffect, useState } from "react";
import { useAdminI18n } from "@/components/admin/layout/AdminI18nProvider";
import type { PendingLeadFollowUp } from "@/modules/leads/services/lead-follow-up.service";

type PendingFollowUpsResponse = {
  data: PendingLeadFollowUp[];
};

export function PendingFollowUpsList() {
  const { t } = useAdminI18n();
  const [items, setItems] = useState<PendingLeadFollowUp[]>([]);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [processingLeadId, setProcessingLeadId] = useState<string | null>(null);

  useEffect(() => {
    async function loadPending() {
      try {
        const response = await fetch("/api/admin/follow-ups/pending");

        if (!response.ok) {
          throw new Error("Failed to load pending follow-ups");
        }

        const json = (await response.json()) as PendingFollowUpsResponse;
        setItems(json.data);
        setStatus("ready");
      } catch {
        setStatus("error");
      }
    }

    loadPending();
  }, []);

  async function markFollowUpAsDone(leadId: string) {
    setProcessingLeadId(leadId);

    try {
      const response = await fetch(`/api/admin/leads/${leadId}/follow-up`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ followUpAt: null })
      });

      if (!response.ok) {
        throw new Error("Failed to clear follow-up");
      }

      setItems((current) => current.filter((item) => item.leadId !== leadId));
    } finally {
      setProcessingLeadId(null);
    }
  }

  return (
    <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-5 py-3.5">
        <div>
          <h2 className="text-base font-bold text-slate-900">{t("pending.queueTitle")}</h2>
          <p className="mt-0.5 text-xs text-slate-500">{t("pending.queueDescription")}</p>
        </div>
        <a
          href="/admin/leads"
          className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:bg-slate-50"
        >
          {t("pending.openCrm")}
        </a>
      </div>

      <div className="px-5 py-3">
        {status === "loading" ? <p className="py-3 text-sm text-slate-500">{t("pending.loading")}</p> : null}
        {status === "error" ? (
          <p className="py-3 text-sm font-medium text-red-600">{t("pending.error")}</p>
        ) : null}
        {status === "ready" && items.length === 0 ? <p className="py-3 text-sm text-slate-500">{t("pending.empty")}</p> : null}

        {status === "ready" && items.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] border-collapse text-sm">
              <thead>
                <tr className="text-left text-[11px] uppercase tracking-wider text-slate-400">
                  <th className="pb-2 pr-3 font-medium">{t("pending.table.lead")}</th>
                  <th className="pb-2 pr-3 font-medium">{t("pending.table.phone")}</th>
                  <th className="pb-2 pr-3 font-medium">{t("pending.table.status")}</th>
                  <th className="pb-2 pr-3 font-medium">{t("pending.table.dueAt")}</th>
                  <th className="pb-2 font-medium">{t("pending.table.action")}</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.leadId} className="border-t border-slate-50 hover:bg-slate-50/50">
                    <td className="py-2.5 pr-3 font-medium text-slate-900">{item.leadName}</td>
                    <td className="py-2.5 pr-3 text-slate-600">{item.leadPhone}</td>
                    <td className="py-2.5 pr-3 text-slate-600">{t(`status.${item.leadStatus}`)}</td>
                    <td className="py-2.5 pr-3 text-slate-600">{new Date(item.followUpAt).toLocaleString()}</td>
                    <td className="py-2.5">
                      <button
                        type="button"
                        onClick={() => markFollowUpAsDone(item.leadId)}
                        disabled={processingLeadId === item.leadId}
                        className="rounded-md bg-slate-900 px-2.5 py-1 text-xs font-medium text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {processingLeadId === item.leadId ? t("pending.saving") : t("pending.markDone")}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : null}
      </div>
    </section>
  );
}
