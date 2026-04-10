import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { authorizeAdminRequest } from "@/modules/auth/services/admin-request-auth.service";
import { createGalleryCategory } from "@/modules/gallery/services/gallery-storage.service";
import { getAdminApiText } from "@/modules/admin/i18n/admin-i18n";

export async function POST(request: Request) {
  const t = (key: string) => getAdminApiText(request, key);
  const auth = authorizeAdminRequest(request, "ADMIN");

  if (!auth.authorized) {
    return NextResponse.json({ statusCode: auth.statusCode, error: auth.error, message: auth.message }, { status: auth.statusCode });
  }

  try {
    const body = await request.json();
    const data = await createGalleryCategory(body);
    return NextResponse.json({ data, message: t("api.gallery.category.created") }, { status: 201 });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ statusCode: 400, error: "Bad Request", message: t("api.gallery.category.invalidPayload") }, { status: 400 });
    }

    if (error instanceof Error && error.message === "CATEGORY_CONFLICT") {
      return NextResponse.json({ statusCode: 409, error: "Conflict", message: t("api.gallery.category.slugConflict") }, { status: 409 });
    }

    return NextResponse.json({ statusCode: 500, error: "Internal Server Error", message: t("api.gallery.category.unexpectedCreate") }, { status: 500 });
  }
}
