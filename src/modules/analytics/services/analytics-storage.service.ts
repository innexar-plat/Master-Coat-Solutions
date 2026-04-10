import { promises as fs } from "node:fs";
import path from "node:path";
import type { AnalyticsEventRecord, AnalyticsSummary } from "@/modules/analytics/dtos/track-event.dto";

const ANALYTICS_FILE_PATH = path.join(process.cwd(), "data", "analytics-events.json");

async function ensureAnalyticsFile() {
  await fs.mkdir(path.dirname(ANALYTICS_FILE_PATH), { recursive: true });

  try {
    await fs.access(ANALYTICS_FILE_PATH);
  } catch {
    await fs.writeFile(ANALYTICS_FILE_PATH, "[]", "utf8");
  }
}

export async function appendAnalyticsEvent(record: AnalyticsEventRecord): Promise<void> {
  await ensureAnalyticsFile();

  const current = await fs.readFile(ANALYTICS_FILE_PATH, "utf8");
  const events = JSON.parse(current) as AnalyticsEventRecord[];

  events.unshift(record);

  await fs.writeFile(ANALYTICS_FILE_PATH, JSON.stringify(events, null, 2), "utf8");
}

export async function readAnalyticsEvents(): Promise<AnalyticsEventRecord[]> {
  await ensureAnalyticsFile();

  const current = await fs.readFile(ANALYTICS_FILE_PATH, "utf8");
  return JSON.parse(current) as AnalyticsEventRecord[];
}

export async function buildAnalyticsSummary(sinceDays = 30): Promise<AnalyticsSummary> {
  const events = await readAnalyticsEvents();
  const safeSinceDays = Number.isFinite(sinceDays) ? Math.max(1, Math.min(365, Math.floor(sinceDays))) : 30;

  const threshold = new Date();
  threshold.setDate(threshold.getDate() - safeSinceDays);

  const filtered = events.filter((event) => {
    const eventDate = new Date(event.occurredAt);
    return Number.isFinite(eventDate.getTime()) && eventDate >= threshold;
  });

  const eventsByName = filtered.reduce<Record<string, number>>((acc, event) => {
    acc[event.eventName] = (acc[event.eventName] ?? 0) + 1;
    return acc;
  }, {});

  const pagesMap = filtered.reduce<Map<string, number>>((acc, event) => {
    acc.set(event.pagePath, (acc.get(event.pagePath) ?? 0) + 1);
    return acc;
  }, new Map<string, number>());

  const topPages = [...pagesMap.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([pagePath, count]) => ({ pagePath, count }));

  return {
    totalEvents: filtered.length,
    uniquePages: pagesMap.size,
    eventsByName,
    topPages,
    lastEventAt: filtered[0]?.occurredAt ?? null
  };
}
