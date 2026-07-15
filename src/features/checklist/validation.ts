import { z } from "zod";

export const recordActivitySchema = z
  .object({
    memberId: z.string().uuid("Select a valid family member."),
    activityId: z.string().uuid("Select a valid activity."),
    entryDate: z
      .string()
      .trim()
      .min(1, "Date is required.")
      .refine((value) => !Number.isNaN(Date.parse(`${value}T00:00:00.000Z`)), "Enter a valid date."),
    status: z.enum(["PENDING", "COMPLETED", "SKIPPED", "MISSED"]),
    activityType: z.enum(["CHECKBOX", "NUMBER", "DURATION", "DISTANCE", "TEXT", "RATING"]),
    booleanValue: z.enum(["true", "false", ""]).transform((value) => (value === "" ? null : value === "true")),
    numberValue: z.string().trim(),
    textValue: z
      .string()
      .trim()
      .transform((value) => (value === "" ? null : value)),
    ratingValue: z.string().trim(),
  })
  .superRefine((data, context) => {
    const needsNumber = ["NUMBER", "DURATION", "DISTANCE"].includes(data.activityType);
    const numberValue = Number(data.numberValue);
    const ratingValue = Number(data.ratingValue);

    if (needsNumber && data.status === "COMPLETED" && (data.numberValue === "" || Number.isNaN(numberValue))) {
      context.addIssue({
        code: "custom",
        message: "Completed numeric activities require a value.",
        path: ["numberValue"],
      });
    }

    if (data.activityType === "RATING" && data.status === "COMPLETED") {
      if (data.ratingValue === "" || Number.isNaN(ratingValue)) {
        context.addIssue({ code: "custom", message: "Completed ratings require a value.", path: ["ratingValue"] });
      }

      if (ratingValue < 1 || ratingValue > 5) {
        context.addIssue({ code: "custom", message: "Rating must be between 1 and 5.", path: ["ratingValue"] });
      }
    }
  })
  .transform((data) => ({
    ...data,
    entryDate: new Date(`${data.entryDate}T00:00:00.000Z`),
    numberValue: ["NUMBER", "DURATION", "DISTANCE"].includes(data.activityType) && data.numberValue !== ""
      ? Number(data.numberValue)
      : null,
    ratingValue: data.activityType === "RATING" && data.ratingValue !== "" ? Number(data.ratingValue) : null,
  }));
