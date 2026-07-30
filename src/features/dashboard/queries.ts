import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/prisma/client";
import { getOwnedFamilyId } from "@/features/family/queries";
import { toDatabaseDate, toDateInputValue } from "@/features/checklist/date";

export async function getDashboardOverview() {
  const familyId = await getOwnedFamilyId();
  const today = toDateInputValue();

  return getCachedDashboardOverview(familyId, today);
}

const getCachedDashboardOverview = unstable_cache(async (familyId: string, today: string) => {
  const todayDate = toDatabaseDate(today);
  const [family, goals, activityCount, requiredActivityCount, todayEntries, recentRecords] = await Promise.all([
    prisma.family.findUniqueOrThrow({
      where: { id: familyId },
      select: {
        name: true,
        members: { orderBy: { createdAt: "asc" }, select: { id: true, name: true } },
      },
    }),
    prisma.goal.findMany({
      where: { familyId },
      orderBy: [{ status: "asc" }, { startDate: "desc" }],
      select: {
        id: true,
        title: true,
        status: true,
        category: true,
        _count: { select: { activities: true } },
      },
    }),
    prisma.activity.count({ where: { goal: { familyId } } }),
    prisma.activity.count({ where: { goal: { familyId }, isRequired: true } }),
    prisma.dailyEntry.findMany({
      where: { familyId, entryDate: todayDate },
      select: {
        memberId: true,
        completionRate: true,
        records: { where: { status: "COMPLETED" }, select: { id: true } },
      },
      orderBy: { createdAt: "asc" },
    }),
    prisma.activityRecord.findMany({
      where: { dailyEntry: { familyId } },
      select: {
        id: true,
        status: true,
        updatedAt: true,
        activity: { select: { title: true } },
        dailyEntry: { select: { member: { select: { name: true } } } },
      },
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
  const completedRecordCount = todayEntries.reduce((total, entry) => total + entry.records.length, 0);

  return {
    family: { name: family.name, memberCount: family.members.length },
    stats: {
      todayCompletion: Math.round(familyCompletion),
      activeGoalCount: activeGoals.length,
      activityCount,
      requiredActivityCount,
      completedRecordCount,
    },
    goals: goals.slice(0, 5).map((goal) => ({
      id: goal.id,
      title: goal.title,
      status: goal.status,
      category: goal.category,
      activityCount: goal._count.activities,
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
}, ["dashboard-overview-v2"], { revalidate: 60, tags: ["dashboard"] });
