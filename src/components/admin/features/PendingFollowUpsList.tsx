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
    <section className="mt-8 rounded-3xl border border-slate-200 bg-white p-5 md:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-black tracking-tight text-slate-900">{t("pending.queueTitle")}</h2>
          <p className="mt-1 text-sm text-slate-600">{t("pending.queueDescription")}</p>
        </div>
        <a
          href="/admin/leads"
          className="inline-flex rounded-full border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-100"
        >
          {t("pending.openCrm")}
        </a>
      </div>

      {status === "loading" ? <p className="mt-4 text-sm text-slate-600">{t("pending.loading")}</p> : null}
      {status === "error" ? (
        <p className="mt-4 text-sm font-semibold text-red-700">{t("pending.error")}</p>
      ) : null}
      {status === "ready" && items.length === 0 ? <p className="mt-4 text-sm text-slate-600">{t("pending.empty")}</p> : null}

      {status === "ready" && items.length > 0 ? (
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[640px] border-collapse text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wide text-slate-500">
                <th className="border-b border-slate-200 px-3 py-2">{t("pending.table.lead")}</th>
                <th className="border-b border-slate-200 px-3 py-2">{t("pending.table.phone")}</th>
                <th className="border-b border-slate-200 px-3 py-2">{t("pending.table.status")}</th>
                <th className="border-b border-slate-200 px-3 py-2">{t("pending.table.dueAt")}</th>
                <th className="border-b border-slate-200 px-3 py-2">{t("pending.table.action")}</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.leadId}>
                  <td className="border-b border-slate-100 px-3 py-3 font-semibold text-slate-900">{item.leadName}</td>
                  <td className="border-b border-slate-100 px-3 py-3 text-slate-700">{item.leadPhone}</td>
                  <td className="border-b border-slate-100 px-3 py-3 text-slate-700">{t(`status.${item.leadStatus}`)}</td>
                  <td className="border-b border-slate-100 px-3 py-3 text-slate-700">{new Date(item.followUpAt).toLocaleString()}</td>
                  <td className="border-b border-slate-100 px-3 py-3">
                    <button
                      type="button"
                      onClick={() => markFollowUpAsDone(item.leadId)}
                      disabled={processingLeadId === item.leadId}
                      className="rounded-lg border border-slate-300 px-3 py-1 text-xs font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
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
    </section>
  );
}
