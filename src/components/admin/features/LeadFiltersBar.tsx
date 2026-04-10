import type { LeadStatus } from "@/modules/leads/dtos/create-lead.dto";
import { useAdminI18n } from "@/components/admin/layout/AdminI18nProvider";

type LeadFiltersBarProps = {
  status: LeadStatus | "ALL";
  search: string;
  onStatusChange: (value: LeadStatus | "ALL") => void;
  onSearchChange: (value: string) => void;
  onApply: () => void;
};

const STATUS_OPTIONS: Array<LeadStatus | "ALL"> = ["ALL", "NEW", "CONTACTED", "QUOTED", "WON", "LOST"];

export function LeadFiltersBar({ status, search, onStatusChange, onSearchChange, onApply }: LeadFiltersBarProps) {
  const { t } = useAdminI18n();

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
      <h2 className="text-xl font-black tracking-tight text-slate-900">{t("filters.title")}</h2>
      <div className="mt-4 grid gap-3 md:grid-cols-[220px_1fr_auto]">
        <select
          value={status}
          onChange={(event) => onStatusChange(event.target.value as LeadStatus | "ALL")}
          className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm"
        >
          {STATUS_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option === "ALL" ? t("filters.all") : t(`status.${option}`)}
            </option>
          ))}
        </select>

        <input
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          className="rounded-xl border border-slate-300 px-3 py-2 text-sm"
          placeholder={t("filters.searchPlaceholder")}
        />

        <button
          type="button"
          onClick={onApply}
          className="rounded-xl bg-slate-900 px-4 py-2 text-xs font-semibold text-white transition hover:bg-slate-700"
        >
          {t("filters.apply")}
        </button>
      </div>
    </section>
  );
}
