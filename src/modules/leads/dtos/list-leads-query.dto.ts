import { z } from "zod";
import { leadStatusSchema } from "@/modules/leads/dtos/create-lead.dto";

export const listLeadsQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  status: leadStatusSchema.optional(),
  locale: z.enum(["en", "pt", "es"]).optional(),
  source: z.enum(["free-estimate", "contact", "landing-page"]).optional(),
  search: z.string().trim().max(120).optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  order: z.enum(["asc", "desc"]).default("desc")
});

export type ListLeadsQueryInput = z.infer<typeof listLeadsQuerySchema>;
