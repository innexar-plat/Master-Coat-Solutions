import type { LeadRecord, LeadStatus } from "@/modules/leads/dtos/create-lead.dto";
import { useAdminI18n } from "@/components/admin/layout/AdminI18nProvider";
import { LeadStatusBadge } from "./LeadStatusBadge";

const STATUS_OPTIONS: LeadStatus[] = ["NEW", "CONTACTED", "QUOTED", "WON", "LOST"];

type LeadInboxTableProps = {
  leads: LeadRecord[];
  onUpdateStatus: (id: string, status: LeadStatus) => void;
  selectedLeadId?: string;
  onSelectLead?: (id: string) => void;
};

export function LeadInboxTable({ leads, onUpdateStatus, selectedLeadId, onSelectLead }: LeadInboxTableProps) {
  const { t } = useAdminI18n();

  return (
    <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-100 px-5 py-3">
        <h2 className="text-sm font-bold text-slate-900">{t("inbox.title")}</h2>
        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-600">
          {leads.length}
        </span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[700px] border-collapse text-sm">
          <thead>
            <tr className="text-left text-[11px] uppercase tracking-wider text-slate-400">
              <th className="px-4 py-2.5">{t("inbox.name")}</th>
              <th className="px-4 py-2.5">{t("inbox.phone")}</th>
              <th className="px-4 py-2.5">{t("inbox.service")}</th>
              <th className="px-4 py-2.5">{t("inbox.status")}</th>
              <th className="px-4 py-2.5">{t("inbox.created")}</th>
              <th className="px-4 py-2.5">{t("inbox.action")}</th>
            </tr>
          </thead>
          <tbody>
            {leads.map((lead) => {
              const isSelected = selectedLeadId === lead.id;

              return (
                <tr
                  key={lead.id}
                  onClick={() => onSelectLead?.(lead.id)}
                  className={`cursor-pointer border-t border-slate-50 transition-colors ${
                    isSelected
                      ? "bg-blue-50/60 ring-1 ring-inset ring-blue-200"
                      : "hover:bg-slate-50"
                  }`}
                >
                  <td className="px-4 py-2.5 font-semibold text-slate-900">{lead.name}</td>
                  <td className="px-4 py-2.5 text-slate-600">{lead.phone}</td>
                  <td className="px-4 py-2.5 text-slate-600">{lead.service}</td>
                  <td className="px-4 py-2.5">
                    <LeadStatusBadge status={lead.status} />
                  </td>
                  <td className="px-4 py-2.5 text-xs text-slate-500">
                    {new Date(lead.createdAt).toLocaleDateString()} {new Date(lead.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </td>
                  <td className="px-4 py-2.5" onClick={(event) => event.stopPropagation()}>
                    <select
                      value={lead.status}
                      onChange={(event) => onUpdateStatus(lead.id, event.target.value as LeadStatus)}
                      className="rounded-md border border-slate-300 bg-white px-2 py-1 text-xs focus:border-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400"
                    >
                      {STATUS_OPTIONS.map((option) => (
                        <option key={option} value={option}>
                          {t(`status.${option}`)}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              );
            })}
            {leads.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-sm text-slate-400">
                  No leads found
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </section>
  );
}
