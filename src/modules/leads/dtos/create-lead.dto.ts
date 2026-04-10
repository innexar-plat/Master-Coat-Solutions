import { z } from "zod";

export const leadStatusSchema = z.enum(["NEW", "CONTACTED", "QUOTED", "WON", "LOST"]);
export type LeadStatus = z.infer<typeof leadStatusSchema>;

export const createLeadSchema = z.object({
  name: z.string().trim().min(2).max(120),
  phone: z.string().trim().min(7).max(30),
  email: z.string().trim().email().max(254).optional().or(z.literal("")),
  service: z.string().trim().min(2).max(120),
  message: z.string().trim().max(2000).optional().or(z.literal("")),
  locale: z.enum(["en", "pt", "es"]).optional().default("en"),
  source: z.enum(["free-estimate", "contact", "landing-page"]).optional().default("free-estimate")
});

export type CreateLeadInput = z.infer<typeof createLeadSchema>;

export type LeadRecord = {
  id: string;
  name: string;
  phone: string;
  email?: string;
  service: string;
  message?: string;
  locale: "en" | "pt" | "es";
  source: "free-estimate" | "contact" | "landing-page";
  status: LeadStatus;
  createdAt: string;
};
