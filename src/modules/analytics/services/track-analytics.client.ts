"use client";

import type { TrackAnalyticsEventInput } from "@/modules/analytics/dtos/track-event.dto";

export async function trackAnalyticsEvent(input: TrackAnalyticsEventInput): Promise<void> {
  try {
    const payload = JSON.stringify(input);

    if (typeof navigator !== "undefined" && typeof navigator.sendBeacon === "function") {
      const blob = new Blob([payload], { type: "application/json" });
      navigator.sendBeacon("/api/analytics/track", blob);
      return;
    }

    await fetch("/api/analytics/track", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: payload,
      keepalive: true
    });
  } catch {
    // Intentionally non-blocking analytics call.
  }
}
