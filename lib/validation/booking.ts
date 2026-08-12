import { z } from 'zod';

export const createBookingSchema = z.object({
  classId: z.string().min(1, 'Class ID is required'),
});

export type CreateBookingInput = z.infer<typeof createBookingSchema>;