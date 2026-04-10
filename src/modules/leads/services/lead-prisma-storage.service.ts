import { prisma } from "@/lib/prisma";
import type { LeadRecord } from "@/modules/leads/dtos/create-lead.dto";

export function toPrismaSource(source: LeadRecord["source"]): "free_estimate" | "contact" | "landing_page" {
  if (source === "free-estimate") {
    return "free_estimate";
  }

  if (source === "landing-page") {
    return "landing_page";
  }

  return "contact";
}

export function fromPrismaSource(source: "free_estimate" | "contact" | "landing_page"): LeadRecord["source"] {
  if (source === "free_estimate") {
    return "free-estimate";
  }

  if (source === "landing_page") {
    return "landing-page";
  }

  return "contact";
}

function toLeadRecord(entity: {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  service: string;
  message: string | null;
  locale: "en" | "pt" | "es";
  source: "free_estimate" | "contact" | "landing_page";
  status: LeadRecord["status"];
  createdAt: Date;
}): LeadRecord {
  return {
    id: entity.id,
    name: entity.name,
    phone: entity.phone,
    email: entity.email ?? undefined,
    service: entity.service,
    message: entity.message ?? undefined,
    locale: entity.locale,
    source: fromPrismaSource(entity.source),
    status: entity.status,
    createdAt: entity.createdAt.toISOString()
  };
}

export async function saveLeadRecordInPrisma(record: LeadRecord): Promise<void> {
  await prisma.lead.create({
    data: {
      id: record.id,
      name: record.name,
      phone: record.phone,
      email: record.email ?? null,
      service: record.service,
      message: record.message ?? null,
      locale: record.locale,
      source: toPrismaSource(record.source),
      status: record.status,
      createdAt: new Date(record.createdAt)
    }
  });
}

export async function readLeadRecordsFromPrisma(): Promise<LeadRecord[]> {
  const entities = await prisma.lead.findMany({
    orderBy: {
      createdAt: "desc"
    }
  });

  return entities.map((entity) => toLeadRecord(entity));
}

export async function updateLeadStatusByIdInPrisma(
  leadId: string,
  status: LeadRecord["status"]
): Promise<LeadRecord | null> {
  const existing = await prisma.lead.findUnique({
    where: {
      id: leadId
    }
  });

  if (!existing) {
    return null;
  }

  const updated = await prisma.lead.update({
    where: {
      id: leadId
    },
    data: {
      status
    }
  });

  return toLeadRecord(updated);
}