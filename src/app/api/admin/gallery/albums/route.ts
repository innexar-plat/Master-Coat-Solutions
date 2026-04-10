import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { authorizeAdminRequest } from "@/modules/auth/services/admin-request-auth.service";
import { createGalleryAlbum } from "@/modules/gallery/services/gallery-storage.service";
import { getAdminApiText } from "@/modules/admin/i18n/admin-i18n";

export async function POST(request: Request) {
  const t = (key: string) => getAdminApiText(request, key);
  const auth = authorizeAdminRequest(request, "ADMIN");

  if (!auth.authorized) {
    return NextResponse.json({ statusCode: auth.statusCode, error: auth.error, message: auth.message }, { status: auth.statusCode });
  }

  try {
    const body = await request.json();
    const data = await createGalleryAlbum(body);
    return NextResponse.json({ data, message: t("api.gallery.album.created") }, { status: 201 });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ statusCode: 400, error: "Bad Request", message: t("api.gallery.album.invalidPayload") }, { status: 400 });
    }

    if (error instanceof Error && error.message === "CATEGORY_NOT_FOUND") {
      return NextResponse.json({ statusCode: 404, error: "Not Found", message: t("api.gallery.category.notFound") }, { status: 404 });
    }

    if (error instanceof Error && error.message === "ALBUM_CONFLICT") {
      return NextResponse.json({ statusCode: 409, error: "Conflict", message: t("api.gallery.album.slugConflict") }, { status: 409 });
    }

    return NextResponse.json({ statusCode: 500, error: "Internal Server Error", message: t("api.gallery.album.unexpectedCreate") }, { status: 500 });
  }
}
