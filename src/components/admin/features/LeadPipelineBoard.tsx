import type { LeadRecord, LeadStatus } from "@/modules/leads/dtos/create-lead.dto";
import { useAdminI18n } from "@/components/admin/layout/AdminI18nProvider";

const ORDERED_STATUS: LeadStatus[] = ["NEW", "CONTACTED", "QUOTED", "WON", "LOST"];

type LeadPipelineBoardProps = {
  leads: LeadRecord[];
};

export function LeadPipelineBoard({ leads }: LeadPipelineBoardProps) {
  const { t } = useAdminI18n();

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
      <h2 className="text-xl font-black tracking-tight text-slate-900">{t("pipeline.title")}</h2>
      <div className="mt-4 grid gap-3 md:grid-cols-5">
        {ORDERED_STATUS.map((status) => {
          const count = leads.filter((lead) => lead.status === status).length;

          return (
            <article key={status} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{t(`status.${status}`)}</p>
              <p className="mt-2 text-2xl font-black text-slate-900">{count}</p>
            </article>
          );
        })}
      </div>
    </section>
  );
}
