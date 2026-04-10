import { NextResponse } from "next/server";
import { authorizeAdminRequest } from "@/modules/auth/services/admin-request-auth.service";
import { listLeadActivities } from "@/modules/leads/services/lead-activity.service";

type Params = {
  params: {
    id: string;
  };
};

export async function GET(request: Request, { params }: Params) {
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

  try {
    const data = await listLeadActivities(params.id);

    return NextResponse.json(
      {
        data
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[admin/leads/:id/activities] unexpected error", {
      leadId: params.id,
      error
    });

    return NextResponse.json(
      {
        statusCode: 500,
        error: "Internal Server Error",
        message: "Unexpected error while loading lead activities"
      },
      { status: 500 }
    );
  }
}
