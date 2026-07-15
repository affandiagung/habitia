import { prisma } from "@/lib/prisma/client";
import { getOwnedFamilyId } from "@/features/family/queries";
import { toDatabaseDate } from "./date";

export async function getChecklistOverview(entryDate: string) {
  const familyId = await getOwnedFamilyId();
  const databaseDate = toDatabaseDate(entryDate);

  const family = await prisma.family.findUniqueOrThrow({
    where: { id: familyId },
    include: {
      members: { orderBy: { createdAt: "asc" } },
      goals: {
        where: { status: "ACTIVE" },
        orderBy: [{ startDate: "desc" }, { createdAt: "desc" }],
        include: {
          activities: {
            orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
          },
        },
      },
      dailyEntries: {
        where: { entryDate: databaseDate },
        include: { records: true },
      },
    },
  });

  return {
    family: {
      id: family.id,
      name: family.name,
      members: family.members.map((member) => ({
        id: member.id,
        name: member.name,
        nickname: member.nickname,
      })),
      goals: family.goals.map((goal) => ({
        id: goal.id,
        title: goal.title,
        activities: goal.activities.map((activity) => ({
          id: activity.id,
          title: activity.title,
          type: activity.type,
          targetValue: activity.targetValue?.toString() ?? null,
          targetUnit: activity.targetUnit,
        })),
      })),
      dailyEntries: family.dailyEntries.map((entry) => ({
        id: entry.id,
        memberId: entry.memberId,
        completionRate: entry.completionRate.toString(),
        records: entry.records.map((record) => ({
          activityId: record.activityId,
          status: record.status,
          booleanValue: record.booleanValue,
          numberValue: record.numberValue?.toString() ?? null,
          textValue: record.textValue,
          ratingValue: record.ratingValue,
        })),
      })),
    },
  };
}
