import type { LeadRecord, LeadStatus } from "@/modules/leads/dtos/create-lead.dto";
import { useAdminI18n } from "@/components/admin/layout/AdminI18nProvider";

const ORDERED_STATUS: LeadStatus[] = ["NEW", "CONTACTED", "QUOTED", "WON", "LOST"];

const PIPELINE_COLORS: Record<LeadStatus, string> = {
  NEW: "border-l-sky-400 bg-sky-50",
  CONTACTED: "border-l-indigo-400 bg-indigo-50",
  QUOTED: "border-l-amber-400 bg-amber-50",
  WON: "border-l-emerald-400 bg-emerald-50",
  LOST: "border-l-rose-400 bg-rose-50"
};

type LeadPipelineBoardProps = {
  leads: LeadRecord[];
};

export function LeadPipelineBoard({ leads }: LeadPipelineBoardProps) {
  const { t } = useAdminI18n();

  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-5">
      {ORDERED_STATUS.map((status) => {
        const count = leads.filter((lead) => lead.status === status).length;

        return (
          <div key={status} className={`rounded-lg border-l-4 px-3 py-2.5 ${PIPELINE_COLORS[status]}`}>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">{t(`status.${status}`)}</p>
            <p className="mt-0.5 text-xl font-black text-slate-900">{count}</p>
          </div>
        );
      })}
    </div>
  );
}
