import { NextResponse } from "next/server";
import { authorizeAdminRequest } from "@/modules/auth/services/admin-request-auth.service";
import { createGalleryItem } from "@/modules/gallery/services/gallery-storage.service";
import { getGalleryUploadLimits, uploadGalleryImage } from "@/modules/gallery/services/gallery-object-storage.service";
import { getAdminApiText } from "@/modules/admin/i18n/admin-i18n";

function toTitleFromFileName(fileName: string) {
  const cleaned = fileName
    .replace(/\.[a-z0-9]+$/i, "")
    .replace(/[-_]+/g, " ")
    .trim();

  if (!cleaned) {
    return "Gallery Project";
  }

  return cleaned
    .split(" ")
    .filter(Boolean)
    .map((token) => token[0].toUpperCase() + token.slice(1))
    .join(" ")
    .slice(0, 140);
}

export async function POST(request: Request) {
  const t = (key: string) => getAdminApiText(request, key);
  const auth = authorizeAdminRequest(request, "ADMIN");

  if (!auth.authorized) {
    return NextResponse.json({ statusCode: auth.statusCode, error: auth.error, message: auth.message }, { status: auth.statusCode });
  }

  try {
    const form = await request.formData();
    const categoryId = String(form.get("categoryId") ?? "").trim();
    const albumId = String(form.get("albumId") ?? "").trim();
    const service = String(form.get("service") ?? "").trim();
    const location = String(form.get("location") ?? "").trim();
    const files = form.getAll("files").filter((entry): entry is File => entry instanceof File);

    const { maxFiles, maxFileSizeBytes } = getGalleryUploadLimits();

    if (!categoryId || !albumId || !service || !location) {
      return NextResponse.json({ statusCode: 400, error: "Bad Request", message: t("api.gallery.upload.requiredFields") }, { status: 400 });
    }

    if (files.length === 0) {
      return NextResponse.json({ statusCode: 400, error: "Bad Request", message: t("api.gallery.upload.atLeastOneFile") }, { status: 400 });
    }

    if (files.length > maxFiles) {
      return NextResponse.json({ statusCode: 400, error: "Bad Request", message: `${t("api.gallery.upload.maxFiles")}: ${maxFiles}` }, { status: 400 });
    }

    const createdItems = [];

    for (const file of files) {
      if (!file.type.startsWith("image/")) {
        return NextResponse.json({ statusCode: 400, error: "Bad Request", message: `${file.name}: ${t("api.gallery.upload.notImage")}` }, { status: 400 });
      }

      if (file.size > maxFileSizeBytes) {
        return NextResponse.json({ statusCode: 400, error: "Bad Request", message: `${file.name}: ${t("api.gallery.upload.exceedsSize")}` }, { status: 400 });
      }

      const bytes = await file.arrayBuffer();
      const upload = await uploadGalleryImage(file.name, file.type, Buffer.from(bytes));

      const created = await createGalleryItem({
        title: toTitleFromFileName(file.name),
        service,
        location,
        imageUrl: upload.url,
        categoryId,
        albumId,
        isPublished: true
      });

      createdItems.push({
        ...created,
        storageProvider: upload.provider,
        storageKey: upload.key
      });
    }

    return NextResponse.json(
      {
        data: createdItems,
        meta: {
          uploaded: createdItems.length,
          maxFiles,
          maxFileSizeBytes
        }
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof Error && error.message === "GALLERY_STORAGE_NOT_CONFIGURED") {
      return NextResponse.json({ statusCode: 500, error: "Internal Server Error", message: t("api.gallery.upload.storageNotConfigured") }, { status: 500 });
    }

    if (error instanceof Error && ["CATEGORY_NOT_FOUND", "ALBUM_NOT_FOUND"].includes(error.message)) {
      return NextResponse.json({ statusCode: 404, error: "Not Found", message: t("api.gallery.shared.categoryOrAlbumNotFound") }, { status: 404 });
    }

    if (error instanceof Error && error.message === "ALBUM_CATEGORY_MISMATCH") {
      return NextResponse.json({ statusCode: 422, error: "Unprocessable Entity", message: t("api.gallery.shared.albumCategoryMismatch") }, { status: 422 });
    }

    return NextResponse.json({ statusCode: 500, error: "Internal Server Error", message: t("api.gallery.upload.unexpected") }, { status: 500 });
  }
}
