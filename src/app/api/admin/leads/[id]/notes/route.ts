import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { authorizeAdminRequest } from "@/modules/auth/services/admin-request-auth.service";
import { getAdminApiText } from "@/modules/admin/i18n/admin-i18n";
import { trackLeadNoteAdded } from "@/modules/leads/services/lead-activity.service";
import { createLeadNote, listLeadNotes } from "@/modules/leads/services/lead-note.service";

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

  const notes = await listLeadNotes(params.id);

  return NextResponse.json(
    {
      data: notes
    },
    { status: 200 }
  );
}

export async function POST(request: Request, { params }: Params) {
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
    const created = await createLeadNote(params.id, body, auth.session.email ?? "admin");

    if (!created) {
      return NextResponse.json(
        {
          statusCode: 404,
          error: "Not Found",
          message: t("api.leads.notFound")
        },
        { status: 404 }
      );
    }

    await trackLeadNoteAdded(params.id, created.note, auth.session.email ?? "admin");

    return NextResponse.json(
      {
        data: created,
        message: t("api.leads.note.created")
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          statusCode: 400,
          error: "Bad Request",
          message: t("api.leads.note.invalidPayload"),
          details: error.issues.map((entry) => ({
            field: entry.path.join("."),
            message: entry.message
          }))
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        statusCode: 500,
        error: "Internal Server Error",
        message: t("api.leads.note.unexpectedCreate")
      },
      { status: 500 }
    );
  }
}
