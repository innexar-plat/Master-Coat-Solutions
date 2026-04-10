import { NextResponse } from "next/server";
import { trackAnalyticsEventSchema } from "@/modules/analytics/dtos/track-event.dto";
import { captureAnalyticsEvent } from "@/modules/analytics/services/analytics-capture.service";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const payload = trackAnalyticsEventSchema.parse(body);

    const event = await captureAnalyticsEvent(payload, {
      referrer: request.headers.get("referer") ?? undefined,
      userAgent: request.headers.get("user-agent") ?? undefined
    });

    return NextResponse.json(
      {
        data: { id: event.id },
        message: "Event tracked"
      },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      {
        statusCode: 400,
        error: "Bad Request",
        message: "Invalid analytics event payload"
      },
      { status: 400 }
    );
  }
}
