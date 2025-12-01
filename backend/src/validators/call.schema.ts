import { z } from 'zod';

export const StartCallSchema = z.object({
  name: z.string().min(3, 'Name required (min 3)'),
  phone: z.string().regex(/^[0-9+]{10,15}$/, 'Invalid phone format'),
  script: z.string().min(10, 'Script required (min 10)'),
  voice: z.string().optional().default('female_calm'),
});

export const StopCallSchema = z.object({
  callId: z.string().min(1),
});
