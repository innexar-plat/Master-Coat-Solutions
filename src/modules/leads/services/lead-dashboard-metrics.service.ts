import { readLeadRecords } from "@/modules/leads/services/lead-storage.service";
import { buildAnalyticsSummary } from "@/modules/analytics/services/analytics-storage.service";

export type DashboardMetrics = {
  leadsToday: number;
  conversionRate: number;
};

export async function buildDashboardMetrics(): Promise<DashboardMetrics> {
  const [leads, analytics] = await Promise.all([readLeadRecords(), buildAnalyticsSummary(30)]);

  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const leadsToday = leads.filter((lead) => new Date(lead.createdAt) >= todayStart).length;

  const pageViews = analytics.eventsByName.PAGE_VIEW ?? 0;
  const leadSubmitEvents = analytics.eventsByName.LEAD_SUBMIT ?? 0;
  const conversionRate = pageViews > 0 ? Number(((leadSubmitEvents / pageViews) * 100).toFixed(1)) : 0;

  return {
    leadsToday,
    conversionRate
  };
}
