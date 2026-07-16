"use server";

import { revalidatePath } from "next/cache";
import { GoalCategory, GoalType } from "@prisma/client";
import { prisma } from "@/lib/prisma/client";
import { recalculateDailyEntryCompletion } from "@/features/checklist/progress";
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

export async function updateGoalAction(
  _state: GoalActionState,
  formData: FormData,
): Promise<GoalActionState> {
  const familyId = await getOwnedFamilyId();
  const goalId = getStringValue(formData, "goalId");
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

  const goal = await prisma.goal.findFirst({ where: { id: goalId, familyId }, select: { id: true } });

  if (!goal) {
    return { error: "Goal was not found." };
  }

  await prisma.goal.update({
    where: { id: goal.id },
    data: {
      title: parsed.data.title,
      description: parsed.data.description,
      icon: parsed.data.icon,
      color: parsed.data.color,
      category: parsed.data.category as GoalCategory,
      type: parsed.data.type as GoalType,
      startDate: parsed.data.startDate,
      endDate: parsed.data.endDate,
    },
  });

  revalidatePath("/goals");
  revalidatePath("/checklist");
  return { message: "Goal updated." };
}

export async function deleteGoalAction(formData: FormData) {
  const familyId = await getOwnedFamilyId();
  const goalId = getStringValue(formData, "goalId");
  const goal = await prisma.goal.findFirst({
    where: { id: goalId, familyId },
    select: { id: true, activities: { select: { id: true } } },
  });

  if (!goal) {
    return;
  }

  const activityIds = goal.activities.map((activity) => activity.id);
  const affectedEntries = activityIds.length === 0
    ? []
    : await prisma.activityRecord.findMany({
        where: { activityId: { in: activityIds } },
        select: { dailyEntryId: true },
        distinct: ["dailyEntryId"],
      });

  await prisma.$transaction([
    prisma.activityRecord.deleteMany({ where: { activityId: { in: activityIds } } }),
    prisma.activity.deleteMany({ where: { goalId: goal.id } }),
    prisma.goal.delete({ where: { id: goal.id } }),
  ]);

  await Promise.all(
    affectedEntries.map((entry) => recalculateDailyEntryCompletion(entry.dailyEntryId, familyId)),
  );

  revalidatePath("/goals");
  revalidatePath("/activities");
  revalidatePath("/checklist");
  revalidatePath("/dashboard");
}
