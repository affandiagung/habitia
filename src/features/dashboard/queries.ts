import { prisma } from "@/lib/prisma/client";
import { getOwnedFamilyId } from "@/features/family/queries";
import { toDatabaseDate, toDateInputValue } from "@/features/checklist/date";

export async function getDashboardOverview() {
  const familyId = await getOwnedFamilyId();
  const today = toDatabaseDate(toDateInputValue());

  const [family, goals, activities, todayEntries, recentRecords] = await Promise.all([
    prisma.family.findUniqueOrThrow({
      where: { id: familyId },
      include: { members: { orderBy: { createdAt: "asc" } } },
    }),
    prisma.goal.findMany({
      where: { familyId },
      orderBy: [{ status: "asc" }, { startDate: "desc" }],
      include: { activities: { select: { id: true, isRequired: true } } },
    }),
    prisma.activity.findMany({ where: { goal: { familyId } }, select: { id: true, isRequired: true } }),
    prisma.dailyEntry.findMany({
      where: { familyId, entryDate: today },
      include: { member: true, records: true },
      orderBy: { createdAt: "asc" },
    }),
    prisma.activityRecord.findMany({
      where: { dailyEntry: { familyId } },
      include: { activity: true, dailyEntry: { include: { member: true } } },
      orderBy: { updatedAt: "desc" },
      take: 6,
    }),
  ]);

  const activeGoals = goals.filter((goal) => goal.status === "ACTIVE");
  const completedToday = todayEntries.reduce(
    (total, entry) => total + Number(entry.completionRate.toString()),
    0,
  );
  const familyCompletion = todayEntries.length === 0 ? 0 : completedToday / todayEntries.length;
  const completedRecords = todayEntries.flatMap((entry) => entry.records).filter((record) => record.status === "COMPLETED");

  return {
    family: { name: family.name, memberCount: family.members.length },
    stats: {
      todayCompletion: Math.round(familyCompletion),
      activeGoalCount: activeGoals.length,
      activityCount: activities.length,
      requiredActivityCount: activities.filter((activity) => activity.isRequired).length,
      completedRecordCount: completedRecords.length,
    },
    goals: goals.slice(0, 5).map((goal) => ({
      id: goal.id,
      title: goal.title,
      status: goal.status,
      category: goal.category,
      activityCount: goal.activities.length,
    })),
    members: family.members.map((member) => {
      const entry = todayEntries.find((item) => item.memberId === member.id);
      return {
        id: member.id,
        name: member.name,
        completionRate: entry?.completionRate.toString() ?? "0",
      };
    }),
    recentRecords: recentRecords.map((record) => ({
      id: record.id,
      memberName: record.dailyEntry.member.name,
      activityTitle: record.activity.title,
      status: record.status,
      updatedAt: record.updatedAt.toISOString(),
    })),
  };
}
