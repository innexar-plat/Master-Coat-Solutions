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
    <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
      <h2 className="text-xl font-black tracking-tight text-slate-900">{t("inbox.title")}</h2>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[760px] border-collapse text-sm">
          <thead>
            <tr className="text-left text-xs uppercase tracking-wide text-slate-500">
              <th className="border-b border-slate-200 px-3 py-2">{t("inbox.name")}</th>
              <th className="border-b border-slate-200 px-3 py-2">{t("inbox.phone")}</th>
              <th className="border-b border-slate-200 px-3 py-2">{t("inbox.service")}</th>
              <th className="border-b border-slate-200 px-3 py-2">{t("inbox.status")}</th>
              <th className="border-b border-slate-200 px-3 py-2">{t("inbox.created")}</th>
              <th className="border-b border-slate-200 px-3 py-2">{t("inbox.action")}</th>
            </tr>
          </thead>
          <tbody>
            {leads.map((lead) => (
              <tr
                key={lead.id}
                className={`align-top ${selectedLeadId === lead.id ? "bg-slate-50" : ""}`}
              >
                <td className="border-b border-slate-100 px-3 py-3 font-semibold text-slate-900">{lead.name}</td>
                <td className="border-b border-slate-100 px-3 py-3 text-slate-700">{lead.phone}</td>
                <td className="border-b border-slate-100 px-3 py-3 text-slate-700">{lead.service}</td>
                <td className="border-b border-slate-100 px-3 py-3">
                  <LeadStatusBadge status={lead.status} />
                </td>
                <td className="border-b border-slate-100 px-3 py-3 text-slate-600">{new Date(lead.createdAt).toLocaleString()}</td>
                <td className="border-b border-slate-100 px-3 py-3">
                  <div className="flex items-center gap-2">
                    <select
                      value={lead.status}
                      onChange={(event) => onUpdateStatus(lead.id, event.target.value as LeadStatus)}
                      className="rounded-lg border border-slate-300 bg-white px-2 py-1 text-xs"
                    >
                      {STATUS_OPTIONS.map((option) => (
                        <option key={option} value={option}>
                          {t(`status.${option}`)}
                        </option>
                      ))}
                    </select>
                    {onSelectLead ? (
                      <button
                        type="button"
                        onClick={() => onSelectLead(lead.id)}
                        className="rounded-lg border border-slate-300 px-2 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-100"
                      >
                        {t("inbox.notes")}
                      </button>
                    ) : null}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
