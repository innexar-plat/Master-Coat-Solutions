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
    if (!leadId || text.trim().length < 2) {
      return;
    }

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
  }

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
      <h2 className="text-xl font-black tracking-tight text-slate-900">{t("notes.title")}</h2>
      {!leadId ? <p className="mt-3 text-sm text-slate-600">{t("notes.selectLead")}</p> : null}

      {leadId ? (
        <div className="mt-4 grid gap-3">
          <textarea
            value={text}
            onChange={(event) => setText(event.target.value)}
            className="min-h-20 rounded-xl border border-slate-300 px-3 py-2 text-sm"
            placeholder={t("notes.placeholder")}
          />
          <button
            type="button"
            onClick={handleCreateNote}
            className="w-fit rounded-xl bg-slate-900 px-4 py-2 text-xs font-semibold text-white transition hover:bg-slate-700"
          >
            {t("notes.add")}
          </button>
        </div>
      ) : null}

      {loading ? <p className="mt-4 text-sm text-slate-600">{t("notes.loading")}</p> : null}

      {leadId && !loading ? (
        <ul className="mt-4 grid gap-2">
          {notes.map((note) => (
            <li key={note.id} className="rounded-xl bg-slate-50 px-3 py-2 text-sm text-slate-800">
              <p>{note.note}</p>
              <p className="mt-1 text-xs text-slate-500">
                {new Date(note.createdAt).toLocaleString()} · {note.createdBy}
              </p>
            </li>
          ))}
          {notes.length === 0 ? <li className="text-sm text-slate-600">{t("notes.empty")}</li> : null}
        </ul>
      ) : null}
    </section>
  );
}
