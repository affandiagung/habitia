import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/prisma/client";
import { getOwnedFamilyId } from "@/features/family/queries";
import { toDatabaseDate } from "./date";

export async function getChecklistOverview(entryDate: string, selectedMemberId?: string) {
  const familyId = await getOwnedFamilyId();

  return getCachedChecklistOverview(familyId, entryDate, selectedMemberId ?? "");
}

const getCachedChecklistOverview = unstable_cache(async (familyId: string, entryDate: string, selectedMemberId: string) => {
  const databaseDate = toDatabaseDate(entryDate);
  const family = await prisma.family.findUniqueOrThrow({
    where: { id: familyId },
    select: {
      id: true,
      name: true,
      members: {
        orderBy: { createdAt: "asc" },
        select: { id: true, name: true, nickname: true },
      },
      goals: {
        where: {
          status: "ACTIVE",
          startDate: { lte: databaseDate },
          OR: [{ endDate: null }, { endDate: { gte: databaseDate } }],
        },
        orderBy: [{ startDate: "desc" }, { createdAt: "desc" }],
        select: {
          id: true,
          title: true,
          activities: {
            orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
            select: {
              id: true,
              title: true,
              type: true,
              targetValue: true,
              targetUnit: true,
            },
          },
        },
      },
    },
  });

  const selectedMember = family.members.find((member) => member.id === selectedMemberId) ?? family.members[0] ?? null;
  const selectedMemberFilter = selectedMemberId && selectedMember ? { memberId: selectedMember.id } : {};
  const dailyEntries = selectedMember
    ? await prisma.dailyEntry.findMany({
        where: { familyId, entryDate: databaseDate, ...selectedMemberFilter },
        select: {
          id: true,
          memberId: true,
          completionRate: true,
          records: {
            select: {
              activityId: true,
              status: true,
              booleanValue: true,
              numberValue: true,
              textValue: true,
              ratingValue: true,
            },
          },
        },
      })
    : [];

  return {
    family: {
      id: family.id,
      name: family.name,
      date: entryDate,
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
      selectedMemberId: selectedMember?.id ?? null,
      dailyEntries: dailyEntries.map((entry) => ({
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
}, ["checklist-overview-v2"], { revalidate: 60, tags: ["checklist"] });
