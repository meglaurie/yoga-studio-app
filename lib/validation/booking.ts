import { z } from "zod";

export const createBookingSchema = z.object({
  classId: z.string().min(1, "Class ID is required"),

  attendeeCount: z
    .number()
    .int()
    .min(1)
    .max(10),
});

export type CreateBookingInput =
  z.infer<typeof createBookingSchema>;