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

export function AdminLeadsWorkspace() {
  const { t } = useAdminI18n();
  const [leads, setLeads] = useState<LeadRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<LeadStatus | "ALL">("ALL");
  const [searchFilter, setSearchFilter] = useState("");
  const [selectedLeadId, setSelectedLeadId] = useState<string | undefined>(undefined);

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
  }

  const sortedLeads = useMemo(() => {
    return [...leads].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }, [leads]);

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
    return <p className="text-sm text-slate-600">{t("leads.loading")}</p>;
  }

  return (
    <div className="grid gap-6">
      <LeadFiltersBar
        status={statusFilter}
        search={searchFilter}
        onStatusChange={setStatusFilter}
        onSearchChange={setSearchFilter}
        onApply={handleApplyFilters}
      />
      <div className="flex justify-end">
        <a
          href={exportCsvUrl}
          className="inline-flex rounded-full border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-100"
        >
          {t("leads.exportCsv")}
        </a>
      </div>
      <LeadPipelineBoard leads={sortedLeads} />
      <LeadInboxTable
        leads={sortedLeads}
        onUpdateStatus={handleUpdateStatus}
        selectedLeadId={selectedLeadId}
        onSelectLead={setSelectedLeadId}
      />
      <LeadNotesPanel leadId={selectedLeadId} />
      <LeadFollowUpPanel leadId={selectedLeadId} />
      <LeadActivityTimeline leadId={selectedLeadId} />
    </div>
  );
}
