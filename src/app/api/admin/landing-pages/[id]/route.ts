import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { authorizeAdminRequest } from "@/modules/auth/services/admin-request-auth.service";
import { getAdminApiText } from "@/modules/admin/i18n/admin-i18n";
import {
  deleteStoredLandingPage,
  updateStoredLandingPage
} from "@/modules/landing-pages/services/landing-page-storage.service";

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
    const updated = await updateStoredLandingPage(params.id, body);

    if (!updated) {
      return NextResponse.json(
        {
          statusCode: 404,
          error: "Not Found",
          message: t("api.landingPages.notFound")
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        data: updated,
        message: t("api.landingPages.updated")
      },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          statusCode: 400,
          error: "Bad Request",
          message: t("api.landingPages.invalidPayload"),
          details: error.issues.map((entry) => ({
            field: entry.path.join("."),
            message: entry.message
          }))
        },
        { status: 400 }
      );
    }

    if (error instanceof Error && error.message === "LANDING_PAGE_CONFLICT") {
      return NextResponse.json(
        {
          statusCode: 409,
          error: "Conflict",
          message: t("api.landingPages.slugConflict")
        },
        { status: 409 }
      );
    }

    return NextResponse.json(
      {
        statusCode: 500,
        error: "Internal Server Error",
        message: t("api.landingPages.unexpectedUpdate")
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request, { params }: Params) {
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

  const removed = await deleteStoredLandingPage(params.id);

  if (!removed) {
    return NextResponse.json(
      {
        statusCode: 404,
        error: "Not Found",
        message: t("api.landingPages.notFound")
      },
      { status: 404 }
    );
  }

  return NextResponse.json(
    {
      message: t("api.landingPages.deleted")
    },
    { status: 200 }
  );
}
