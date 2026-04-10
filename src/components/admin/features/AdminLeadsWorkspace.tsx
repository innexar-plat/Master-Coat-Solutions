"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useAdminI18n } from "@/components/admin/layout/AdminI18nProvider";
import type { LeadRecord, LeadStatus } from "@/modules/leads/dtos/create-lead.dto";
import { LeadPipelineBoard } from "./LeadPipelineBoard";
import { LeadInboxTable } from "./LeadInboxTable";
import { LeadFiltersBar } from "./LeadFiltersBar";
import { LeadNotesPanel } from "./LeadNotesPanel";
import { LeadFollowUpPanel } from "./LeadFollowUpPanel";
import { LeadActivityTimeline } from "./LeadActivityTimeline";

type DetailTab = "notes" | "followUp" | "timeline";

export function AdminLeadsWorkspace() {
  const { t } = useAdminI18n();
  const [leads, setLeads] = useState<LeadRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<LeadStatus | "ALL">("ALL");
  const [searchFilter, setSearchFilter] = useState("");
  const [selectedLeadId, setSelectedLeadId] = useState<string | undefined>(undefined);
  const [detailTab, setDetailTab] = useState<DetailTab>("notes");
  const [detailRefreshKey, setDetailRefreshKey] = useState(0);

  const loadLeads = useCallback(async (filters?: { status?: LeadStatus; search?: string }) => {
    const query = new URLSearchParams({
      page: "1",
      limit: "100",
      order: "desc"
    });

    if (filters?.status) {
      query.set("status", filters.status);
    }

    if (filters?.search) {
      query.set("search", filters.search);
    }

    const response = await fetch(`/api/admin/leads?${query.toString()}`);

    if (!response.ok) {
      throw new Error("Failed to load leads");
    }

    const json = (await response.json()) as { data: LeadRecord[] };
    setLeads(json.data);
  }, []);

  useEffect(() => {
    if (selectedLeadId) {
      return;
    }

    if (leads.length > 0) {
      setSelectedLeadId(leads[0]?.id);
    }
  }, [leads, selectedLeadId]);

  useEffect(() => {
    async function initialLoad() {
      try {
        await loadLeads();
      } finally {
        setLoading(false);
      }
    }

    initialLoad();
  }, [loadLeads]);

  async function handleApplyFilters() {
    setLoading(true);
    try {
      await loadLeads({
        status: statusFilter === "ALL" ? undefined : statusFilter,
        search: searchFilter.trim() || undefined
      });
    } finally {
      setLoading(false);
    }
  }

  async function handleUpdateStatus(id: string, status: LeadStatus) {
    const response = await fetch(`/api/admin/leads/${id}/status`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ status })
    });

    if (!response.ok) {
      return;
    }

    setLeads((current) => current.map((lead) => (lead.id === id ? { ...lead, status } : lead)));
    setDetailRefreshKey((k) => k + 1);
  }

  function handleSelectLead(id: string) {
    setSelectedLeadId(id);
    setDetailTab("notes");
    setDetailRefreshKey((k) => k + 1);
  }

  const sortedLeads = useMemo(() => {
    return [...leads].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }, [leads]);

  const selectedLead = useMemo(() => {
    return leads.find((lead) => lead.id === selectedLeadId);
  }, [leads, selectedLeadId]);

  const exportCsvUrl = useMemo(() => {
    const query = new URLSearchParams({
      page: "1",
      limit: "100",
      order: "desc"
    });

    if (statusFilter !== "ALL") {
      query.set("status", statusFilter);
    }

    if (searchFilter.trim()) {
      query.set("search", searchFilter.trim());
    }

    return `/api/admin/leads/export?${query.toString()}`;
  }, [statusFilter, searchFilter]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-slate-900" />
        <span className="ml-3 text-sm font-medium text-slate-600">{t("leads.loading")}</span>
      </div>
    );
  }

  const DETAIL_TABS: { key: DetailTab; label: string }[] = [
    { key: "notes", label: t("notes.title") },
    { key: "followUp", label: t("followUp.title") },
    { key: "timeline", label: t("timeline.title") }
  ];

  return (
    <div className="grid gap-5">
      {/* Top bar: filters + export */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <LeadFiltersBar
          status={statusFilter}
          search={searchFilter}
          onStatusChange={setStatusFilter}
          onSearchChange={setSearchFilter}
          onApply={handleApplyFilters}
        />
        <a
          href={exportCsvUrl}
          className="inline-flex items-center gap-1.5 self-end rounded-lg border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
          {t("leads.exportCsv")}
        </a>
      </div>

      {/* Pipeline counters */}
      <LeadPipelineBoard leads={sortedLeads} />

      {/* Main content: table + detail panel */}
      <div className="grid gap-5 xl:grid-cols-[1fr_380px]">
        {/* Left: lead table */}
        <LeadInboxTable
          leads={sortedLeads}
          onUpdateStatus={handleUpdateStatus}
          selectedLeadId={selectedLeadId}
          onSelectLead={handleSelectLead}
        />

        {/* Right: detail panel */}
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          {/* Selected lead header */}
          {selectedLead ? (
            <div className="border-b border-slate-100 px-5 py-4">
              <h3 className="text-base font-bold text-slate-900">{selectedLead.name}</h3>
              <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                <span>{selectedLead.phone}</span>
                {selectedLead.email ? (
                  <>
                    <span className="text-slate-300">·</span>
                    <span>{selectedLead.email}</span>
                  </>
                ) : null}
                <span className="text-slate-300">·</span>
                <span>{selectedLead.service}</span>
              </div>
              {selectedLead.message ? (
                <p className="mt-2 text-xs italic text-slate-400 line-clamp-2">&quot;{selectedLead.message}&quot;</p>
              ) : null}
            </div>
          ) : (
            <div className="flex items-center justify-center px-5 py-12">
              <p className="text-sm text-slate-400">{t("notes.selectLead")}</p>
            </div>
          )}

          {/* Tabs */}
          {selectedLead ? (
            <>
              <div className="flex border-b border-slate-100">
                {DETAIL_TABS.map((tab) => (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => setDetailTab(tab.key)}
                    className={`flex-1 px-3 py-2.5 text-xs font-semibold transition ${
                      detailTab === tab.key
                        ? "border-b-2 border-slate-900 text-slate-900"
                        : "text-slate-400 hover:text-slate-600"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <div className="p-4">
                {detailTab === "notes" ? (
                  <LeadNotesPanel leadId={selectedLeadId} key={`notes-${selectedLeadId}-${detailRefreshKey}`} />
                ) : null}
                {detailTab === "followUp" ? (
                  <LeadFollowUpPanel leadId={selectedLeadId} key={`followup-${selectedLeadId}-${detailRefreshKey}`} />
                ) : null}
                {detailTab === "timeline" ? (
                  <LeadActivityTimeline leadId={selectedLeadId} key={`timeline-${selectedLeadId}-${detailRefreshKey}`} />
                ) : null}
              </div>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}
