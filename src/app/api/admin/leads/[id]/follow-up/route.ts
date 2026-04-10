import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { authorizeAdminRequest } from "@/modules/auth/services/admin-request-auth.service";
import { getAdminApiText } from "@/modules/admin/i18n/admin-i18n";
import { trackLeadFollowUpUpdated } from "@/modules/leads/services/lead-activity.service";
import {
  getLeadFollowUpByLeadId,
  updateLeadFollowUpByLeadId
} from "@/modules/leads/services/lead-follow-up.service";

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

  const followUp = await getLeadFollowUpByLeadId(params.id);

  if (!followUp) {
    return NextResponse.json(
      {
        data: null
      },
      { status: 200 }
    );
  }

  return NextResponse.json(
    {
      data: followUp
    },
    { status: 200 }
  );
}

export async function PATCH(request: Request, { params }: Params) {
  const t = (key: string) => getAdminApiText(request, key);
  const auth = authorizeAdminRequest(request, "ADMIN");

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
    const body = await request.json();
    const updated = await updateLeadFollowUpByLeadId(params.id, body);

    if (!updated) {
      return NextResponse.json(
        {
          statusCode: 404,
          error: "Not Found",
          message: t("api.leads.notFound")
        },
        { status: 404 }
      );
    }

    await trackLeadFollowUpUpdated(params.id, updated.followUpAt, auth.session.email ?? "admin");

    return NextResponse.json(
      {
        data: updated,
        message: t("api.leads.followUp.updated")
      },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          statusCode: 400,
          error: "Bad Request",
          message: t("api.leads.followUp.invalidPayload"),
          details: error.issues.map((entry) => ({
            field: entry.path.join("."),
            message: entry.message
          }))
        },
        { status: 400 }
      );
    }

    console.error("[admin/leads/:id/follow-up] unexpected error", {
      leadId: params.id,
      error
    });

    return NextResponse.json(
      {
        statusCode: 500,
        error: "Internal Server Error",
        message: t("api.leads.followUp.unexpectedUpdate")
      },
      { status: 500 }
    );
  }
}
