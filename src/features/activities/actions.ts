"use server";

import { revalidatePath } from "next/cache";
import { ActivityType, Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma/client";
import { getOwnedFamilyId } from "@/features/family/queries";
import { enumerateGoalDates } from "@/features/checklist/progress";
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
    select: { id: true, startDate: true, endDate: true },
  });

  if (!ownedGoal) {
    return { error: "Selected goal was not found." };
  }

  const activity = await prisma.activity.create({
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

  const [members, dates] = await Promise.all([
    prisma.familyMember.findMany({ where: { familyId }, select: { id: true } }),
    Promise.resolve(enumerateGoalDates(ownedGoal.startDate, ownedGoal.endDate)),
  ]);

  for (const member of members) {
    for (const entryDate of dates) {
      const dailyEntry = await prisma.dailyEntry.upsert({
        where: { memberId_entryDate: { memberId: member.id, entryDate } },
        update: { familyId },
        create: { familyId, memberId: member.id, entryDate },
      });

      await prisma.activityRecord.upsert({
        where: { dailyEntryId_activityId: { dailyEntryId: dailyEntry.id, activityId: activity.id } },
        update: {},
        create: {
          dailyEntryId: dailyEntry.id,
          activityId: activity.id,
          status: "PENDING",
        },
      });
    }
  }

  revalidatePath("/activities");
  revalidatePath("/goals");
  return { message: "Activity created." };
}
