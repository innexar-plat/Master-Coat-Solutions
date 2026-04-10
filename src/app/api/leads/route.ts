import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { captureLead } from "@/modules/leads/services/lead-capture.service";
import { saveLeadRecord } from "@/modules/leads/services/lead-storage.service";
import { notifyNewLead } from "@/modules/leads/services/lead-notification.service";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const lead = await captureLead(body, {
      storage: { saveLeadRecord },
      notifier: { notifyNewLead }
    });

    return NextResponse.json(
      {
        data: {
          id: lead.id,
          createdAt: lead.createdAt
        },
        message: "Lead captured successfully"
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          statusCode: 400,
          error: "Bad Request",
          message: "Validation failed",
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
        message: "Unexpected error while capturing lead"
      },
      { status: 500 }
    );
  }
}
