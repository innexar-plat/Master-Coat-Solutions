import { NextResponse } from "next/server";
import { authorizeAdminRequest } from "@/modules/auth/services/admin-request-auth.service";
import { listPendingFollowUps } from "@/modules/leads/services/lead-follow-up.service";

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

  const data = await listPendingFollowUps();

  return NextResponse.json(
    {
      data
    },
    { status: 200 }
  );
}
