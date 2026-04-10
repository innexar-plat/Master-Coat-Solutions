import type { LeadRecord } from "@/modules/leads/dtos/create-lead.dto";
import type { ListLeadsQueryInput } from "@/modules/leads/dtos/list-leads-query.dto";
import { readLeadRecords } from "@/modules/leads/services/lead-storage.service";

export type ListLeadsResult = {
  data: LeadRecord[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
};

export function filterLeadRecords(leads: LeadRecord[], query: ListLeadsQueryInput): LeadRecord[] {
  const searchTerm = query.search?.toLowerCase();
  const startDate = query.startDate ? new Date(query.startDate) : null;
  const endDate = query.endDate ? new Date(query.endDate) : null;

  return leads
    .filter((lead) => {
      if (query.status && lead.status !== query.status) {
        return false;
      }

      if (query.locale && lead.locale !== query.locale) {
        return false;
      }

      if (query.source && lead.source !== query.source) {
        return false;
      }

      if (searchTerm) {
        const haystack = [lead.name, lead.phone, lead.email ?? "", lead.service, lead.message ?? ""]
          .join(" ")
          .toLowerCase();

        if (!haystack.includes(searchTerm)) {
          return false;
        }
      }

      if (startDate) {
        const createdAt = new Date(lead.createdAt);
        if (createdAt < startDate) {
          return false;
        }
      }

      if (endDate) {
        const createdAt = new Date(lead.createdAt);
        if (createdAt > endDate) {
          return false;
        }
      }

      return true;
    })
    .sort((a, b) => {
      if (query.order === "asc") {
        return a.createdAt.localeCompare(b.createdAt);
      }

      return b.createdAt.localeCompare(a.createdAt);
    });
}

export async function listLeads(query: ListLeadsQueryInput): Promise<ListLeadsResult> {
  const records = await readLeadRecords();
  const filtered = filterLeadRecords(records, query);

  const total = filtered.length;
  const offset = (query.page - 1) * query.limit;
  const paginated = filtered.slice(offset, offset + query.limit);

  return {
    data: paginated,
    meta: {
      total,
      page: query.page,
      limit: query.limit,
      totalPages: Math.max(1, Math.ceil(total / query.limit))
    }
  };
}
