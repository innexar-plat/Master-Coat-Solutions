import { z } from "zod";

export const landingPageStatusSchema = z.enum(["DRAFT", "PUBLISHED"]);

export const createLandingPageSchema = z.object({
  slug: z.string().trim().min(3).max(120).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  name: z.string().trim().min(3).max(120),
  headline: z.string().trim().min(10).max(220),
  status: landingPageStatusSchema.default("DRAFT")
});

export const updateLandingPageSchema = createLandingPageSchema.partial().refine(
  (payload) => Object.keys(payload).length > 0,
  { message: "At least one field must be provided" }
);

export type CreateLandingPageInput = z.infer<typeof createLandingPageSchema>;
export type UpdateLandingPageInput = z.infer<typeof updateLandingPageSchema>;
export type LandingPageStatus = z.infer<typeof landingPageStatusSchema>;
