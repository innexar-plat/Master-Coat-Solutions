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

  function handleKeyDown(event: React.KeyboardEvent) {
    if (event.key === "Enter") {
      onApply();
    }
  }

  return (
    <div className="flex flex-1 flex-wrap items-center gap-2">
      <div className="relative">
        <svg xmlns="http://www.w3.org/2000/svg" className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
        </svg>
        <input
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          onKeyDown={handleKeyDown}
          className="rounded-lg border border-slate-300 py-2 pl-8 pr-3 text-sm shadow-sm focus:border-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400"
          placeholder={t("filters.searchPlaceholder")}
        />
      </div>

      <select
        value={status}
        onChange={(event) => {
          onStatusChange(event.target.value as LeadStatus | "ALL");
          onApply();
        }}
        className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400"
      >
        {STATUS_OPTIONS.map((option) => (
          <option key={option} value={option}>
            {option === "ALL" ? t("filters.all") : t(`status.${option}`)}
          </option>
        ))}
      </select>

      <button
        type="button"
        onClick={onApply}
        className="rounded-lg bg-slate-900 px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-slate-700"
      >
        {t("filters.apply")}
      </button>
    </div>
  );
}
