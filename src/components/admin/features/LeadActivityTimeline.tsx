"use client";

import { useEffect, useState } from "react";
import { useAdminI18n } from "@/components/admin/layout/AdminI18nProvider";
import type { LeadActivityRecord } from "@/modules/leads/services/lead-activity.service";

type LeadActivityTimelineProps = {
  leadId?: string;
};

export function LeadActivityTimeline({ leadId }: LeadActivityTimelineProps) {
  const { t } = useAdminI18n();
  const [activities, setActivities] = useState<LeadActivityRecord[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadActivities() {
      if (!leadId) {
        setActivities([]);
        return;
      }

      setLoading(true);
      try {
        const response = await fetch(`/api/admin/leads/${leadId}/activities`);
        if (!response.ok) {
          throw new Error("Failed to load activities");
        }

        const json = (await response.json()) as { data: LeadActivityRecord[] };
        setActivities(json.data);
      } finally {
        setLoading(false);
      }
    }

    loadActivities();
  }, [leadId]);

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
      <h2 className="text-xl font-black tracking-tight text-slate-900">{t("timeline.title")}</h2>
      {!leadId ? <p className="mt-3 text-sm text-slate-600">{t("timeline.selectLead")}</p> : null}

      {loading ? <p className="mt-4 text-sm text-slate-600">{t("timeline.loading")}</p> : null}

      {leadId && !loading ? (
        <ul className="mt-4 grid gap-2">
          {activities.map((activity) => (
            <li key={activity.id} className="rounded-xl bg-slate-50 px-3 py-2 text-sm text-slate-800">
              <p>{activity.description}</p>
              <p className="mt-1 text-xs text-slate-500">
                {new Date(activity.createdAt).toLocaleString()} · {activity.createdBy}
              </p>
            </li>
          ))}
          {activities.length === 0 ? <li className="text-sm text-slate-600">{t("timeline.empty")}</li> : null}
        </ul>
      ) : null}
    </section>
  );
}
