"use server";

import { revalidatePath } from "next/cache";
import { ActivityType, Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma/client";
import { getOwnedFamilyId } from "@/features/family/queries";
import { createActivitySchema } from "./validation";

type ActivityActionState = {
  error?: string;
  message?: string;
};

function getStringValue(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function getFirstValidationError(error: { flatten: () => { fieldErrors: Record<string, string[]> } }) {
  return Object.values(error.flatten().fieldErrors).flat()[0] ?? "Please check the form values.";
}

export async function createActivityAction(
  _state: ActivityActionState,
  formData: FormData,
): Promise<ActivityActionState> {
  const familyId = await getOwnedFamilyId();
  const parsed = createActivitySchema.safeParse({
    goalId: getStringValue(formData, "goalId"),
    title: getStringValue(formData, "title"),
    description: getStringValue(formData, "description"),
    type: getStringValue(formData, "type") || "CHECKBOX",
    targetValue: getStringValue(formData, "targetValue"),
    targetUnit: getStringValue(formData, "targetUnit"),
    sortOrder: getStringValue(formData, "sortOrder") || "0",
    isRequired: getStringValue(formData, "isRequired") || "true",
  });

  if (!parsed.success) {
    return { error: getFirstValidationError(parsed.error) };
  }

  const ownedGoal = await prisma.goal.findFirst({
    where: { id: parsed.data.goalId, familyId },
    select: { id: true },
  });

  if (!ownedGoal) {
    return { error: "Selected goal was not found." };
  }

  await prisma.activity.create({
    data: {
      goalId: ownedGoal.id,
      title: parsed.data.title,
      description: parsed.data.description,
      type: parsed.data.type as ActivityType,
      targetValue:
        parsed.data.targetValue === null ? null : new Prisma.Decimal(parsed.data.targetValue),
      targetUnit: parsed.data.targetUnit,
      sortOrder: parsed.data.sortOrder,
      isRequired: parsed.data.isRequired,
    },
  });

  revalidatePath("/activities");
  revalidatePath("/goals");
  return { message: "Activity created." };
}
