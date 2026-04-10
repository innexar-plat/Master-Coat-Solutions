import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { authorizeAdminRequest } from "@/modules/auth/services/admin-request-auth.service";
import { deleteGalleryItem, updateGalleryItem } from "@/modules/gallery/services/gallery-storage.service";
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
    const data = await updateGalleryItem(params.id, body);

    if (!data) {
      return NextResponse.json({ statusCode: 404, error: "Not Found", message: t("api.gallery.item.notFound") }, { status: 404 });
    }

    return NextResponse.json({ data, message: t("api.gallery.item.updated") }, { status: 200 });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ statusCode: 400, error: "Bad Request", message: t("api.gallery.item.invalidPayload") }, { status: 400 });
    }

    if (error instanceof Error && ["CATEGORY_NOT_FOUND", "ALBUM_NOT_FOUND"].includes(error.message)) {
      return NextResponse.json({ statusCode: 404, error: "Not Found", message: t("api.gallery.shared.categoryOrAlbumNotFound") }, { status: 404 });
    }

    if (error instanceof Error && error.message === "ALBUM_CATEGORY_MISMATCH") {
      return NextResponse.json({ statusCode: 422, error: "Unprocessable Entity", message: t("api.gallery.shared.albumCategoryMismatch") }, { status: 422 });
    }

    return NextResponse.json({ statusCode: 500, error: "Internal Server Error", message: t("api.gallery.item.unexpectedUpdate") }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: Params) {
  const t = (key: string) => getAdminApiText(request, key);
  const auth = authorizeAdminRequest(request, "ADMIN");

  if (!auth.authorized) {
    return NextResponse.json({ statusCode: auth.statusCode, error: auth.error, message: auth.message }, { status: auth.statusCode });
  }

  const removed = await deleteGalleryItem(params.id);

  if (!removed) {
    return NextResponse.json({ statusCode: 404, error: "Not Found", message: t("api.gallery.item.notFound") }, { status: 404 });
  }

  return NextResponse.json({ message: t("api.gallery.item.deleted") }, { status: 200 });
}
