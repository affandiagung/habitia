import { z } from "zod";

export const createActivitySchema = z
  .object({
    goalId: z.string().uuid("Select a valid goal."),
    title: z.string().trim().min(2, "Activity title must be at least 2 characters."),
    description: z
      .string()
      .trim()
      .transform((value) => (value === "" ? null : value)),
    type: z.enum(["CHECKBOX", "NUMBER", "DURATION", "DISTANCE", "TEXT", "RATING"]),
    targetValue: z.string().trim(),
    targetUnit: z
      .string()
      .trim()
      .transform((value) => (value === "" ? null : value)),
    sortOrder: z.coerce.number().int().min(0).default(0),
    isRequired: z.enum(["true", "false"]).transform((value) => value === "true"),
  })
  .superRefine((data, context) => {
    const needsNumericTarget = ["NUMBER", "DURATION", "DISTANCE", "RATING"].includes(data.type);
    const targetNumber = Number(data.targetValue);

    if (needsNumericTarget && (data.targetValue === "" || Number.isNaN(targetNumber))) {
      context.addIssue({
        code: "custom",
        message: "This activity type requires a numeric target.",
        path: ["targetValue"],
      });
    }

    if (needsNumericTarget && targetNumber <= 0) {
      context.addIssue({
        code: "custom",
        message: "Target value must be greater than zero.",
        path: ["targetValue"],
      });
    }

    if (data.type === "RATING" && targetNumber > 5) {
      context.addIssue({
        code: "custom",
        message: "Rating target cannot be greater than 5.",
        path: ["targetValue"],
      });
    }
  })
  .transform((data) => ({
    ...data,
    targetValue: ["NUMBER", "DURATION", "DISTANCE", "RATING"].includes(data.type)
      ? Number(data.targetValue)
      : null,
  }));
