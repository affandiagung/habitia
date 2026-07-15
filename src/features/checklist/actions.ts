"use server";

import { revalidatePath } from "next/cache";
import { ActivityRecordStatus, Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma/client";
import { getOwnedFamilyId } from "@/features/family/queries";
import { recordActivitySchema } from "./validation";

type ChecklistActionState = {
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

export async function recordActivityAction(
  _state: ChecklistActionState,
  formData: FormData,
): Promise<ChecklistActionState> {
  const familyId = await getOwnedFamilyId();
  const entryDateValue = getStringValue(formData, "entryDate");
  const parsed = recordActivitySchema.safeParse({
    memberId: getStringValue(formData, "memberId"),
    activityId: getStringValue(formData, "activityId"),
    entryDate: entryDateValue,
    status: getStringValue(formData, "status") || "PENDING",
    activityType: getStringValue(formData, "activityType") || "CHECKBOX",
    booleanValue: getStringValue(formData, "booleanValue"),
    numberValue: getStringValue(formData, "numberValue"),
    textValue: getStringValue(formData, "textValue"),
    ratingValue: getStringValue(formData, "ratingValue"),
  });

  if (!parsed.success) {
    return { error: getFirstValidationError(parsed.error) };
  }

  const [member, activity, requiredActivities] = await Promise.all([
    prisma.familyMember.findFirst({ where: { id: parsed.data.memberId, familyId }, select: { id: true } }),
    prisma.activity.findFirst({
      where: { id: parsed.data.activityId, goal: { familyId } },
      select: { id: true, type: true },
    }),
    prisma.activity.findMany({
      where: { isRequired: true, goal: { familyId, status: "ACTIVE" } },
      select: { id: true },
    }),
  ]);

  if (!member || !activity) {
    return { error: "Selected checklist item was not found." };
  }

  const booleanValue = activity.type === "CHECKBOX" ? parsed.data.status === "COMPLETED" : parsed.data.booleanValue;

  const dailyEntry = await prisma.dailyEntry.upsert({
    where: { memberId_entryDate: { memberId: member.id, entryDate: parsed.data.entryDate } },
    update: { familyId },
    create: {
      familyId,
      memberId: member.id,
      entryDate: parsed.data.entryDate,
    },
  });

  await prisma.activityRecord.upsert({
    where: { dailyEntryId_activityId: { dailyEntryId: dailyEntry.id, activityId: activity.id } },
    update: {
      status: parsed.data.status as ActivityRecordStatus,
      booleanValue,
      numberValue:
        parsed.data.numberValue === null ? null : new Prisma.Decimal(parsed.data.numberValue),
      textValue: parsed.data.textValue,
      ratingValue: parsed.data.ratingValue,
      completedAt: parsed.data.status === "COMPLETED" ? new Date() : null,
    },
    create: {
      dailyEntryId: dailyEntry.id,
      activityId: activity.id,
      status: parsed.data.status as ActivityRecordStatus,
      booleanValue,
      numberValue:
        parsed.data.numberValue === null ? null : new Prisma.Decimal(parsed.data.numberValue),
      textValue: parsed.data.textValue,
      ratingValue: parsed.data.ratingValue,
      completedAt: parsed.data.status === "COMPLETED" ? new Date() : null,
    },
  });

  const completedRequiredCount = await prisma.activityRecord.count({
    where: {
      dailyEntryId: dailyEntry.id,
      status: "COMPLETED",
      activityId: { in: requiredActivities.map((item) => item.id) },
    },
  });
  const completionRate = requiredActivities.length === 0 ? 0 : (completedRequiredCount / requiredActivities.length) * 100;

  await prisma.dailyEntry.update({
    where: { id: dailyEntry.id },
    data: { completionRate: new Prisma.Decimal(completionRate.toFixed(2)) },
  });

  revalidatePath(`/checklist?date=${entryDateValue}`);
  revalidatePath("/dashboard");
  return { message: "Progress saved." };
}
