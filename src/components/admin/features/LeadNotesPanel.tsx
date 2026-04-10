"use client";

import { useEffect, useState } from "react";
import { useAdminI18n } from "@/components/admin/layout/AdminI18nProvider";
import type { LeadNoteRecord } from "@/modules/leads/dtos/create-lead-note.dto";

type LeadNotesPanelProps = {
  leadId?: string;
};

export function LeadNotesPanel({ leadId }: LeadNotesPanelProps) {
  const { t } = useAdminI18n();
  const [notes, setNotes] = useState<LeadNoteRecord[]>([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function loadNotes() {
      if (!leadId) {
        setNotes([]);
        return;
      }

      setLoading(true);
      try {
        const response = await fetch(`/api/admin/leads/${leadId}/notes`);
        if (!response.ok) {
          throw new Error("Failed to load notes");
        }

        const json = (await response.json()) as { data: LeadNoteRecord[] };
        setNotes(json.data);
      } finally {
        setLoading(false);
      }
    }

    loadNotes();
  }, [leadId]);

  async function handleCreateNote() {
    if (!leadId || text.trim().length < 2 || saving) {
      return;
    }

    setSaving(true);
    try {
      const response = await fetch(`/api/admin/leads/${leadId}/notes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ note: text })
      });

      if (!response.ok) {
        return;
      }

      const json = (await response.json()) as { data: LeadNoteRecord };
      setNotes((current) => [json.data, ...current]);
      setText("");
    } finally {
      setSaving(false);
    }
  }

  function handleKeyDown(event: React.KeyboardEvent) {
    if (event.key === "Enter" && (event.ctrlKey || event.metaKey)) {
      handleCreateNote();
    }
  }

  if (!leadId) {
    return <p className="text-sm text-slate-400">{t("notes.selectLead")}</p>;
  }

  return (
    <div className="grid gap-3">
      <div className="relative">
        <textarea
          value={text}
          onChange={(event) => setText(event.target.value)}
          onKeyDown={handleKeyDown}
          rows={3}
          className="w-full resize-none rounded-lg border border-slate-200 px-3 py-2 text-sm placeholder:text-slate-300 focus:border-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400"
          placeholder={t("notes.placeholder")}
        />
        <button
          type="button"
          onClick={handleCreateNote}
          disabled={text.trim().length < 2 || saving}
          className="absolute bottom-2.5 right-2.5 rounded-md bg-slate-900 px-3 py-1 text-[11px] font-semibold text-white transition hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {saving ? "..." : t("notes.add")}
        </button>
      </div>

      {loading ? (
        <p className="text-xs text-slate-400">{t("notes.loading")}</p>
      ) : (
        <div className="max-h-[320px] space-y-2 overflow-y-auto">
          {notes.map((note) => (
            <div key={note.id} className="rounded-lg bg-slate-50 px-3 py-2">
              <p className="text-sm text-slate-800">{note.note}</p>
              <p className="mt-1 text-[11px] text-slate-400">
                {new Date(note.createdAt).toLocaleString()} · {note.createdBy}
              </p>
            </div>
          ))}
          {notes.length === 0 ? (
            <p className="py-4 text-center text-xs text-slate-400">{t("notes.empty")}</p>
          ) : null}
        </div>
      )}
    </div>
  );
}
