import { NextResponse } from "next/server";
import { authorizeAdminRequest } from "@/modules/auth/services/admin-request-auth.service";
import { getAdminApiText } from "@/modules/admin/i18n/admin-i18n";
import { listLeadsQuerySchema } from "@/modules/leads/dtos/list-leads-query.dto";
import { listLeads } from "@/modules/leads/services/list-leads.service";

function escapeCsv(value: string): string {
  const normalized = value.replaceAll("\"", "\"\"");
  return `\"${normalized}\"`;
}

export async function GET(request: Request) {
  const t = (key: string) => getAdminApiText(request, key);
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

  try {
    const url = new URL(request.url);
    const parsedQuery = listLeadsQuerySchema.parse({
      page: url.searchParams.get("page") ?? "1",
      limit: url.searchParams.get("limit") ?? "100",
      status: url.searchParams.get("status") ?? undefined,
      locale: url.searchParams.get("locale") ?? undefined,
      source: url.searchParams.get("source") ?? undefined,
      search: url.searchParams.get("search") ?? undefined,
      startDate: url.searchParams.get("startDate") ?? undefined,
      endDate: url.searchParams.get("endDate") ?? undefined,
      order: url.searchParams.get("order") ?? "desc"
    });

    const result = await listLeads(parsedQuery);

    const header = ["id", "name", "phone", "email", "service", "status", "source", "locale", "createdAt"];
    const rows = result.data.map((lead) =>
      [
        lead.id,
        lead.name,
        lead.phone,
        lead.email ?? "",
        lead.service,
        lead.status,
        lead.source,
        lead.locale,
        lead.createdAt
      ]
        .map((value) => escapeCsv(String(value)))
        .join(",")
    );

    const csv = [header.join(","), ...rows].join("\n");

    return new Response(csv, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": "attachment; filename=leads-export.csv"
      }
    });
  } catch {
    return NextResponse.json(
      {
        statusCode: 400,
        error: "Bad Request",
        message: t("api.leads.invalidExportQuery")
      },
      { status: 400 }
    );
  }
}
