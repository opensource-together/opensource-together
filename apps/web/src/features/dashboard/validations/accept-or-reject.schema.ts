import z from "zod";

export const applicationDecisionSchema = z.object({
  decision: z.enum(["ACCEPTED", "REJECTED"]),
  rejectionReason: z.string().optional(),
});

export type ApplicationDecisionForm = z.infer<typeof applicationDecisionSchema>;
