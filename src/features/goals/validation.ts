import { z } from "zod";

export const createGoalSchema = z
  .object({
    title: z.string().trim().min(2, "Goal title must be at least 2 characters."),
    description: z
      .string()
      .trim()
      .transform((value) => (value === "" ? null : value)),
    icon: z
      .string()
      .trim()
      .transform((value) => (value === "" ? null : value)),
    color: z.enum(["slate", "emerald", "sky", "violet", "rose", "amber"]),
    category: z.enum(["HEALTH", "RELIGION", "LEARNING", "FINANCE", "LIFESTYLE", "CUSTOM"]),
    type: z.enum(["CUSTOM", "TEMPLATE"]),
    startDate: z
      .string()
      .trim()
      .min(1, "Start date is required.")
      .refine((value) => !Number.isNaN(Date.parse(`${value}T00:00:00.000Z`)), "Enter a valid start date."),
    endDate: z
      .string()
      .trim()
      .refine((value) => value === "" || !Number.isNaN(Date.parse(`${value}T00:00:00.000Z`)), {
        message: "Enter a valid end date.",
      }),
  })
  .refine(
    (data) => data.endDate === "" || new Date(data.endDate) >= new Date(data.startDate),
    { message: "End date must be after the start date.", path: ["endDate"] },
  )
  .transform((data) => ({
    ...data,
    startDate: new Date(`${data.startDate}T00:00:00.000Z`),
    endDate: data.endDate === "" ? null : new Date(`${data.endDate}T00:00:00.000Z`),
  }));
