"use client";

import { useEffect, useMemo, useState } from "react";
import { useAdminI18n } from "@/components/admin/layout/AdminI18nProvider";
import type { LeadFollowUpRecord } from "@/modules/leads/dtos/lead-follow-up.dto";

type LeadFollowUpPanelProps = {
  leadId?: string;
};

function toInputValue(iso: string | null | undefined): string {
  if (!iso) {
    return "";
  }

  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hour = String(date.getHours()).padStart(2, "0");
  const minute = String(date.getMinutes()).padStart(2, "0");

  return `${year}-${month}-${day}T${hour}:${minute}`;
}

export function LeadFollowUpPanel({ leadId }: LeadFollowUpPanelProps) {
  const { t } = useAdminI18n();
  const [inputValue, setInputValue] = useState("");
  const [record, setRecord] = useState<LeadFollowUpRecord | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function load() {
      if (!leadId) {
        setRecord(null);
        setInputValue("");
        return;
      }

      setLoading(true);

      try {
        const response = await fetch(`/api/admin/leads/${leadId}/follow-up`);
        if (!response.ok) {
          throw new Error("Failed to load follow-up");
        }

        const json = (await response.json()) as { data: LeadFollowUpRecord | null };
        setRecord(json.data);
        setInputValue(toInputValue(json.data?.followUpAt ?? null));
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [leadId]);

  async function saveFollowUp(followUpAt: string | null) {
    if (!leadId) {
      return;
    }

    const response = await fetch(`/api/admin/leads/${leadId}/follow-up`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ followUpAt })
    });

    if (!response.ok) {
      return;
    }

    const json = (await response.json()) as { data: LeadFollowUpRecord };
    setRecord(json.data);
    setInputValue(toInputValue(json.data.followUpAt));
  }

  const formatted = useMemo(() => {
    if (!record?.followUpAt) {
      return t("followUp.empty");
    }

    return new Date(record.followUpAt).toLocaleString();
  }, [record, t]);

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
      <h2 className="text-xl font-black tracking-tight text-slate-900">{t("followUp.title")}</h2>
      {!leadId ? <p className="mt-3 text-sm text-slate-600">{t("followUp.selectLead")}</p> : null}

      {leadId ? (
        <div className="mt-4 grid gap-3">
          <input
            type="datetime-local"
            value={inputValue}
            onChange={(event) => setInputValue(event.target.value)}
            className="rounded-xl border border-slate-300 px-3 py-2 text-sm"
          />
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => saveFollowUp(inputValue ? new Date(inputValue).toISOString() : null)}
              className="rounded-xl bg-slate-900 px-4 py-2 text-xs font-semibold text-white transition hover:bg-slate-700"
            >
              {t("followUp.save")}
            </button>
            <button
              type="button"
              onClick={() => saveFollowUp(null)}
              className="rounded-xl border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-100"
            >
              {t("followUp.clear")}
            </button>
          </div>
          {loading ? <p className="text-sm text-slate-600">{t("followUp.loading")}</p> : null}
          {!loading ? <p className="text-sm text-slate-600">{formatted}</p> : null}
        </div>
      ) : null}
    </section>
  );
}
