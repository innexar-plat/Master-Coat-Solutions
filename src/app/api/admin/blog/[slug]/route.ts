import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { authorizeAdminRequest } from "@/modules/auth/services/admin-request-auth.service";
import { deleteStoredBlogPost, updateStoredBlogPost } from "@/modules/blog/services/blog-storage.service";
import { getAdminApiText } from "@/modules/admin/i18n/admin-i18n";

type Params = {
  params: {
    slug: string;
  };
};

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

  const removed = await deleteStoredBlogPost(params.slug);

  if (!removed) {
    return NextResponse.json(
      {
        statusCode: 404,
        error: "Not Found",
        message: t("api.blog.notFound")
      },
      { status: 404 }
    );
  }

  return NextResponse.json(
    {
      message: t("api.blog.deleted")
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
    const updated = await updateStoredBlogPost(params.slug, body);

    if (!updated) {
      return NextResponse.json(
        {
          statusCode: 404,
          error: "Not Found",
          message: t("api.blog.notFound")
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        data: updated,
        message: t("api.blog.updated")
      },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          statusCode: 400,
          error: "Bad Request",
          message: t("api.blog.invalidPayload"),
          details: error.issues.map((entry) => ({
            field: entry.path.join("."),
            message: entry.message
          }))
        },
        { status: 400 }
      );
    }

    if (error instanceof Error && error.message === "BLOG_POST_CONFLICT") {
      return NextResponse.json(
        {
          statusCode: 409,
          error: "Conflict",
          message: t("api.blog.slugConflict")
        },
        { status: 409 }
      );
    }

    return NextResponse.json(
      {
        statusCode: 500,
        error: "Internal Server Error",
        message: t("api.blog.unexpectedUpdate")
      },
      { status: 500 }
    );
  }
}
