import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { authorizeAdminRequest } from "@/modules/auth/services/admin-request-auth.service";
import { getAdminApiText } from "@/modules/admin/i18n/admin-i18n";
import {
  createStoredLandingPage,
  listStoredLandingPages
} from "@/modules/landing-pages/services/landing-page-storage.service";

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

  const data = await listStoredLandingPages();

  return NextResponse.json(
    {
      data
    },
    { status: 200 }
  );
}

export async function POST(request: Request) {
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
    const created = await createStoredLandingPage(body);

    return NextResponse.json(
      {
        data: created,
        message: t("api.landingPages.created")
      },
      { status: 201 }
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
        message: t("api.landingPages.unexpectedCreate")
      },
      { status: 500 }
    );
  }
}
