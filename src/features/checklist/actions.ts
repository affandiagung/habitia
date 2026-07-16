"use server";

import { revalidatePath } from "next/cache";
import { ActivityRecordStatus, Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma/client";
import { getOwnedFamilyId } from "@/features/family/queries";
import { recalculateDailyEntryCompletion } from "./progress";
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

  const [member, activity] = await Promise.all([
    prisma.familyMember.findFirst({ where: { id: parsed.data.memberId, familyId }, select: { id: true } }),
    prisma.activity.findFirst({
      where: { id: parsed.data.activityId, goal: { familyId } },
      select: { id: true, type: true, goal: { select: { startDate: true, endDate: true, status: true } } },
    }),
  ]);

  if (!member || !activity) {
    return { error: "Selected checklist item was not found." };
  }

  if (
    activity.goal.status !== "ACTIVE" ||
    parsed.data.entryDate < activity.goal.startDate ||
    (activity.goal.endDate && parsed.data.entryDate > activity.goal.endDate)
  ) {
    return { error: "This activity is not scheduled for the selected date." };
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

  await recalculateDailyEntryCompletion(dailyEntry.id, familyId);

  revalidatePath(`/checklist?date=${entryDateValue}`);
  revalidatePath("/dashboard");
  return { message: "Progress saved." };
}
