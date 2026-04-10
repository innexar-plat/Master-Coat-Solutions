import { z } from "zod";

export const analyticsEventNameSchema = z.enum(["PAGE_VIEW", "CTA_CLICK", "PHONE_CLICK", "LEAD_SUBMIT"]);

const analyticsMetadataValueSchema = z.union([z.string(), z.number(), z.boolean()]);

export const trackAnalyticsEventSchema = z.object({
  eventName: analyticsEventNameSchema,
  pagePath: z.string().trim().min(1).max(200),
  locale: z.enum(["en", "pt", "es"]).optional().default("en"),
  source: z.string().trim().max(120).optional(),
  metadata: z.record(z.string(), analyticsMetadataValueSchema).optional()
});

export type TrackAnalyticsEventInput = z.infer<typeof trackAnalyticsEventSchema>;

export type AnalyticsEventRecord = TrackAnalyticsEventInput & {
  id: string;
  occurredAt: string;
  referrer?: string;
  userAgent?: string;
};

export type AnalyticsSummary = {
  totalEvents: number;
  uniquePages: number;
  eventsByName: Record<string, number>;
  topPages: Array<{ pagePath: string; count: number }>;
  lastEventAt: string | null;
};
