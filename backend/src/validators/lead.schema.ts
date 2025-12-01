import { z } from "zod";

export const LeadCreateSchema = z.object({
  name: z.string().min(3, "Name required (min 3)"),
  phone: z
    .string()
    .regex(/^[0-9+]{10,15}$/, "Invalid phone format"),
  script: z.string().min(10, "Script required (min 10)"),
});

export const ScheduleSchema = z.object({
  scheduledAt: z.string().min(1, "Schedule time required"),
});
