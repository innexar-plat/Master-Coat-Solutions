import type { LeadStatus } from "@/modules/leads/dtos/create-lead.dto";
import { useAdminI18n } from "@/components/admin/layout/AdminI18nProvider";

type LeadStatusBadgeProps = {
  status: LeadStatus;
};

const STATUS_STYLE: Record<LeadStatus, string> = {
  NEW: "bg-sky-100 text-sky-800 border-sky-200",
  CONTACTED: "bg-indigo-100 text-indigo-800 border-indigo-200",
  QUOTED: "bg-amber-100 text-amber-800 border-amber-200",
  WON: "bg-emerald-100 text-emerald-800 border-emerald-200",
  LOST: "bg-rose-100 text-rose-800 border-rose-200"
};

export function LeadStatusBadge({ status }: LeadStatusBadgeProps) {
  const { t } = useAdminI18n();

  return (
    <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${STATUS_STYLE[status]}`}>
      {t(`status.${status}`)}
    </span>
  );
}
