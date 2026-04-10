import { z } from "zod";

export const updateLeadFollowUpSchema = z.object({
  followUpAt: z.string().datetime().nullable()
});

export type UpdateLeadFollowUpInput = z.infer<typeof updateLeadFollowUpSchema>;

export type LeadFollowUpRecord = {
  leadId: string;
  followUpAt: string | null;
  updatedAt: string;
};
