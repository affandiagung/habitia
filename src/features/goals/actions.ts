"use server";

import { revalidatePath } from "next/cache";
import { GoalCategory, GoalType } from "@prisma/client";
import { prisma } from "@/lib/prisma/client";
import { getOwnedFamilyId } from "@/features/family/queries";
import { createGoalSchema } from "./validation";

type GoalActionState = {
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

export async function createGoalAction(
  _state: GoalActionState,
  formData: FormData,
): Promise<GoalActionState> {
  const familyId = await getOwnedFamilyId();
  const parsed = createGoalSchema.safeParse({
    title: getStringValue(formData, "title"),
    description: getStringValue(formData, "description"),
    icon: getStringValue(formData, "icon"),
    color: getStringValue(formData, "color") || "slate",
    category: getStringValue(formData, "category") || "CUSTOM",
    type: getStringValue(formData, "type") || "CUSTOM",
    startDate: getStringValue(formData, "startDate"),
    endDate: getStringValue(formData, "endDate"),
  });

  if (!parsed.success) {
    return { error: getFirstValidationError(parsed.error) };
  }

  await prisma.goal.create({
    data: {
      familyId,
      title: parsed.data.title,
      description: parsed.data.description,
      icon: parsed.data.icon,
      color: parsed.data.color,
      category: parsed.data.category as GoalCategory,
      type: parsed.data.type as GoalType,
      status: "ACTIVE",
      startDate: parsed.data.startDate,
      endDate: parsed.data.endDate,
    },
  });

  revalidatePath("/goals");
  return { message: "Goal created." };
}
