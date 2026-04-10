import { randomUUID } from "node:crypto";
import type {
  AnalyticsEventRecord,
  TrackAnalyticsEventInput
} from "@/modules/analytics/dtos/track-event.dto";
import { appendAnalyticsEvent } from "@/modules/analytics/services/analytics-storage.service";

type AnalyticsCaptureDependencies = {
  storage?: {
    appendAnalyticsEvent: (record: AnalyticsEventRecord) => Promise<void>;
  };
};

type AnalyticsRequestContext = {
  referrer?: string;
  userAgent?: string;
};

export async function captureAnalyticsEvent(
  input: TrackAnalyticsEventInput,
  context: AnalyticsRequestContext = {},
  dependencies: AnalyticsCaptureDependencies = {}
): Promise<AnalyticsEventRecord> {
  const storage = dependencies.storage ?? { appendAnalyticsEvent };

  const record: AnalyticsEventRecord = {
    id: randomUUID(),
    ...input,
    occurredAt: new Date().toISOString(),
    referrer: context.referrer,
    userAgent: context.userAgent
  };

  await storage.appendAnalyticsEvent(record);

  return record;
}
