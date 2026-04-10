import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { authorizeAdminRequest } from "@/modules/auth/services/admin-request-auth.service";
import { deleteGalleryCategory, updateGalleryCategory } from "@/modules/gallery/services/gallery-storage.service";
import { getAdminApiText } from "@/modules/admin/i18n/admin-i18n";

type Params = { params: { id: string } };

export async function PATCH(request: Request, { params }: Params) {
  const t = (key: string) => getAdminApiText(request, key);
  const auth = authorizeAdminRequest(request, "ADMIN");

  if (!auth.authorized) {
    return NextResponse.json({ statusCode: auth.statusCode, error: auth.error, message: auth.message }, { status: auth.statusCode });
  }

  try {
    const body = await request.json();
    const data = await updateGalleryCategory(params.id, body);

    if (!data) {
      return NextResponse.json({ statusCode: 404, error: "Not Found", message: t("api.gallery.category.notFound") }, { status: 404 });
    }

    return NextResponse.json({ data, message: t("api.gallery.category.updated") }, { status: 200 });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ statusCode: 400, error: "Bad Request", message: t("api.gallery.category.invalidPayload") }, { status: 400 });
    }

    if (error instanceof Error && error.message === "CATEGORY_CONFLICT") {
      return NextResponse.json({ statusCode: 409, error: "Conflict", message: t("api.gallery.category.slugConflict") }, { status: 409 });
    }

    return NextResponse.json({ statusCode: 500, error: "Internal Server Error", message: t("api.gallery.category.unexpectedUpdate") }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: Params) {
  const t = (key: string) => getAdminApiText(request, key);
  const auth = authorizeAdminRequest(request, "ADMIN");

  if (!auth.authorized) {
    return NextResponse.json({ statusCode: auth.statusCode, error: auth.error, message: auth.message }, { status: auth.statusCode });
  }

  try {
    const removed = await deleteGalleryCategory(params.id);

    if (!removed) {
      return NextResponse.json({ statusCode: 404, error: "Not Found", message: t("api.gallery.category.notFound") }, { status: 404 });
    }

    return NextResponse.json({ message: t("api.gallery.category.deleted") }, { status: 200 });
  } catch (error) {
    if (error instanceof Error && error.message === "CATEGORY_IN_USE") {
      return NextResponse.json({ statusCode: 409, error: "Conflict", message: t("api.gallery.category.inUse") }, { status: 409 });
    }

    return NextResponse.json({ statusCode: 500, error: "Internal Server Error", message: t("api.gallery.category.unexpectedDelete") }, { status: 500 });
  }
}
