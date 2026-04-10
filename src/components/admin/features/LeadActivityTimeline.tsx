"use client";

import { useEffect, useState } from "react";
import { useAdminI18n } from "@/components/admin/layout/AdminI18nProvider";
import { IconRefresh, IconFileText, IconClock } from "@/components/admin/shared/AdminIcons";
import type { LeadActivityRecord } from "@/modules/leads/services/lead-activity.service";
import type { ComponentType, SVGProps } from "react";

type LeadActivityTimelineProps = {
  leadId?: string;
};

type IconComponent = ComponentType<SVGProps<SVGSVGElement> & { size?: number }>;

const ACTIVITY_ICONS: Record<string, IconComponent> = {
  STATUS_CHANGED: IconRefresh,
  NOTE_ADDED: IconFileText,
  FOLLOW_UP_UPDATED: IconClock
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

  if (!leadId) {
    return <p className="text-sm text-slate-400">{t("timeline.selectLead")}</p>;
  }

  if (loading) {
    return <p className="text-xs text-slate-400">{t("timeline.loading")}</p>;
  }

  if (activities.length === 0) {
    return <p className="py-4 text-center text-xs text-slate-400">{t("timeline.empty")}</p>;
  }

  return (
    <div className="max-h-[360px] overflow-y-auto">
      <div className="relative space-y-0">
        {activities.map((activity, index) => (
          <div key={activity.id} className="relative flex gap-3 pb-4">
            {/* Vertical line */}
            {index < activities.length - 1 ? (
              <div className="absolute left-[11px] top-6 h-full w-px bg-slate-200" />
            ) : null}

            {/* Icon */}
            <div className="relative z-10 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-500">
              {(() => {
                const ActivityIcon = ACTIVITY_ICONS[activity.type];
                return ActivityIcon ? <ActivityIcon size={12} /> : <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />;
              })()}
            </div>

            {/* Content */}
            <div className="flex-1 pt-0.5">
              <p className="text-sm text-slate-700">{activity.description}</p>
              <p className="mt-0.5 text-[11px] text-slate-400">
                {new Date(activity.createdAt).toLocaleString()} · {activity.createdBy}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
