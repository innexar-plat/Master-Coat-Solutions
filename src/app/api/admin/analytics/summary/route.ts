import { NextResponse } from "next/server";
import { authorizeAdminRequest } from "@/modules/auth/services/admin-request-auth.service";
import { buildAnalyticsSummary } from "@/modules/analytics/services/analytics-storage.service";

export async function GET(request: Request) {
  const auth = authorizeAdminRequest(request, "VIEWER");

  if (!auth.authorized) {
    return NextResponse.json(
      {
        statusCode: auth.statusCode,
        error: auth.error,
        message: auth.message
      },
      { status: auth.statusCode }
    );
  }

  const url = new URL(request.url);
  const sinceDaysParam = Number(url.searchParams.get("sinceDays") ?? "30");
  const summary = await buildAnalyticsSummary(sinceDaysParam);

  return NextResponse.json(
    {
      data: summary
    },
    { status: 200 }
  );
}
