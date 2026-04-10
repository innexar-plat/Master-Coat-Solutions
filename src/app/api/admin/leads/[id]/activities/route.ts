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

  const data = await listLeadActivities(params.id);

  return NextResponse.json(
    {
      data
    },
    { status: 200 }
  );
}
