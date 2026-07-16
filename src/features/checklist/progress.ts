import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma/client";

export async function recalculateDailyEntryCompletion(dailyEntryId: string, familyId: string) {
  const dailyEntry = await prisma.dailyEntry.findUnique({
    where: { id: dailyEntryId },
    select: { entryDate: true },
  });

  if (!dailyEntry) {
    return;
  }

  const requiredActivities = await prisma.activity.findMany({
    where: {
      isRequired: true,
      goal: {
        familyId,
        status: "ACTIVE",
        startDate: { lte: dailyEntry.entryDate },
        OR: [{ endDate: null }, { endDate: { gte: dailyEntry.entryDate } }],
      },
    },
    select: { id: true },
  });

  const completedRequiredCount = await prisma.activityRecord.count({
    where: {
      dailyEntryId,
      status: "COMPLETED",
      activityId: { in: requiredActivities.map((activity) => activity.id) },
    },
  });

  const completionRate = requiredActivities.length === 0
    ? 0
    : (completedRequiredCount / requiredActivities.length) * 100;

  await prisma.dailyEntry.update({
    where: { id: dailyEntryId },
    data: { completionRate: new Prisma.Decimal(completionRate.toFixed(2)) },
  });
}

export function enumerateGoalDates(startDate: Date, endDate: Date | null) {
  const dates: Date[] = [];
  const current = new Date(Date.UTC(startDate.getUTCFullYear(), startDate.getUTCMonth(), startDate.getUTCDate()));
  const last = endDate
    ? new Date(Date.UTC(endDate.getUTCFullYear(), endDate.getUTCMonth(), endDate.getUTCDate()))
    : new Date(current);

  while (current <= last) {
    dates.push(new Date(current));
    current.setUTCDate(current.getUTCDate() + 1);
  }

  return dates;
}
