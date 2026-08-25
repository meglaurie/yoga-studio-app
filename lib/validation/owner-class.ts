import { z } from "zod";

export const createClassSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(1, "Class name is required.")
      .max(100, "Class name must be 100 characters or fewer."),

    description: z
      .string()
      .trim()
      .max(500, "Description must be 500 characters or fewer.")
      .optional()
      .or(z.literal("")),

    instructorName: z
      .string()
      .trim()
      .min(1, "Instructor name is required.")
      .max(100, "Instructor name must be 100 characters or fewer."),

    level: z.enum([
      "BEGINNER",
      "ALL_LEVELS",
      "INTERMEDIATE",
      "ADVANCED",
    ]),

    startAt: z.string().min(1, "Start time is required."),

    endAt: z.string().min(1, "End time is required."),

    capacity: z.coerce
      .number()
      .int("Capacity must be a whole number.")
      .min(1, "Capacity must be at least 1.")
      .max(100, "Capacity cannot exceed 100."),
  })
  .superRefine((data, ctx) => {
    const start = new Date(data.startAt);
    const end = new Date(data.endAt);

    if (Number.isNaN(start.getTime())) {
      ctx.addIssue({
        code: "custom",
        path: ["startAt"],
        message: "Please enter a valid start date and time.",
      });
    }

    if (Number.isNaN(end.getTime())) {
      ctx.addIssue({
        code: "custom",
        path: ["endAt"],
        message: "Please enter a valid end date and time.",
      });
    }

    if (
      !Number.isNaN(start.getTime()) &&
      !Number.isNaN(end.getTime()) &&
      end <= start
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["endAt"],
        message: "End time must be after the start time.",
      });
    }

    if (
      !Number.isNaN(start.getTime()) &&
      start <= new Date()
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["startAt"],
        message: "Class must be scheduled in the future.",
      });
    }
  });

export type CreateClassInput = z.infer<typeof createClassSchema>;

export const updateClassSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(1, "Class name is required.")
      .max(100, "Class name must be 100 characters or fewer."),

    description: z
      .string()
      .trim()
      .max(500, "Description must be 500 characters or fewer.")
      .optional()
      .or(z.literal("")),

    instructorName: z
      .string()
      .trim()
      .min(1, "Instructor name is required.")
      .max(100, "Instructor name must be 100 characters or fewer."),

    level: z.enum([
      "BEGINNER",
      "ALL_LEVELS",
      "INTERMEDIATE",
      "ADVANCED",
    ]),

    startAt: z.string().min(1, "Start time is required."),
    endAt: z.string().min(1, "End time is required."),

    capacity: z.coerce
      .number()
      .int("Capacity must be a whole number.")
      .min(1, "Capacity must be at least 1.")
      .max(100, "Capacity cannot exceed 100."),
  })
  .superRefine((data, ctx) => {
    const start = new Date(data.startAt);
    const end = new Date(data.endAt);

    if (Number.isNaN(start.getTime())) {
      ctx.addIssue({
        code: "custom",
        path: ["startAt"],
        message: "Please enter a valid start date and time.",
      });
    }

    if (Number.isNaN(end.getTime())) {
      ctx.addIssue({
        code: "custom",
        path: ["endAt"],
        message: "Please enter a valid end date and time.",
      });
    }

    if (
      !Number.isNaN(start.getTime()) &&
      !Number.isNaN(end.getTime()) &&
      end <= start
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["endAt"],
        message: "End time must be after the start time.",
      });
    }
  });

export type UpdateClassInput = z.infer<typeof updateClassSchema>;