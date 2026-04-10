import { z } from "zod";

export const createLeadNoteSchema = z.object({
  note: z.string().trim().min(2).max(1200)
});

export type CreateLeadNoteInput = z.infer<typeof createLeadNoteSchema>;

export type LeadNoteRecord = {
  id: string;
  leadId: string;
  note: string;
  createdAt: string;
  createdBy: string;
};
