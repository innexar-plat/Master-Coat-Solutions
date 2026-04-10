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
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

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
    if (!leadId || saving) {
      return;
    }

    setSaving(true);
    setSaved(false);
    try {
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
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } finally {
      setSaving(false);
    }
  }

  const formatted = useMemo(() => {
    if (!record?.followUpAt) {
      return null;
    }

    return new Date(record.followUpAt).toLocaleString();
  }, [record]);

  if (!leadId) {
    return <p className="text-sm text-slate-400">{t("followUp.selectLead")}</p>;
  }

  if (loading) {
    return <p className="text-xs text-slate-400">{t("followUp.loading")}</p>;
  }

  return (
    <div className="grid gap-3">
      {formatted ? (
        <div className="flex items-center gap-2 rounded-lg bg-blue-50 px-3 py-2.5 text-sm">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
          </svg>
          <span className="font-medium text-blue-800">{formatted}</span>
        </div>
      ) : (
        <p className="text-xs text-slate-400">{t("followUp.empty")}</p>
      )}

      <input
        type="datetime-local"
        value={inputValue}
        onChange={(event) => setInputValue(event.target.value)}
        className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400"
      />

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => saveFollowUp(inputValue ? new Date(inputValue).toISOString() : null)}
          disabled={saving}
          className="rounded-lg bg-slate-900 px-4 py-1.5 text-xs font-semibold text-white transition hover:bg-slate-700 disabled:opacity-40"
        >
          {saving ? "..." : t("followUp.save")}
        </button>
        <button
          type="button"
          onClick={() => {
            setInputValue("");
            saveFollowUp(null);
          }}
          disabled={saving}
          className="rounded-lg border border-slate-200 px-4 py-1.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-40"
        >
          {t("followUp.clear")}
        </button>
        {saved ? (
          <span className="text-xs font-medium text-emerald-600">✓ Saved</span>
        ) : null}
      </div>
    </div>
  );
}
