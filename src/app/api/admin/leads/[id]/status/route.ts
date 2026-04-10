import { NextResponse } from "next/server";
import { z } from "zod";
import { authorizeAdminRequest } from "@/modules/auth/services/admin-request-auth.service";
import { getAdminApiText } from "@/modules/admin/i18n/admin-i18n";
import { leadStatusSchema } from "@/modules/leads/dtos/create-lead.dto";
import { trackLeadStatusChanged } from "@/modules/leads/services/lead-activity.service";
import { updateLeadStatusById } from "@/modules/leads/services/lead-storage.service";

const updateStatusSchema = z.object({
  status: leadStatusSchema
});

type Params = {
  params: {
    id: string;
  };
};

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
    const payload = updateStatusSchema.parse(body);

    const updated = await updateLeadStatusById(params.id, payload.status);

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

    await trackLeadStatusChanged(params.id, payload.status, auth.session.email ?? "admin");

    return NextResponse.json(
      {
        data: updated,
        message: t("api.leads.status.updated")
      },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      {
        statusCode: 400,
        error: "Bad Request",
        message: t("api.leads.status.invalidPayload")
      },
      { status: 400 }
    );
  }
}
