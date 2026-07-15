import { prisma } from "@/lib/prisma/client";
import { getOwnedFamilyId } from "@/features/family/queries";

export async function getReportsOverview() {
  const familyId = await getOwnedFamilyId();

  const [members, goals, entries, records] = await Promise.all([
    prisma.familyMember.findMany({ where: { familyId }, orderBy: { createdAt: "asc" } }),
    prisma.goal.findMany({ where: { familyId }, include: { activities: true }, orderBy: { createdAt: "desc" } }),
    prisma.dailyEntry.findMany({ where: { familyId }, include: { member: true }, orderBy: { entryDate: "desc" } }),
    prisma.activityRecord.findMany({
      where: { dailyEntry: { familyId } },
      include: { activity: { include: { goal: true } }, dailyEntry: { include: { member: true } } },
    }),
  ]);

  const averageCompletion = entries.length === 0
    ? 0
    : entries.reduce((sum, entry) => sum + Number(entry.completionRate.toString()), 0) / entries.length;
  const completedRecords = records.filter((record) => record.status === "COMPLETED");
  const missedRecords = records.filter((record) => record.status === "MISSED");

  const memberReports = members.map((member) => {
    const memberEntries = entries.filter((entry) => entry.memberId === member.id);
    const average = memberEntries.length === 0
      ? 0
      : memberEntries.reduce((sum, entry) => sum + Number(entry.completionRate.toString()), 0) / memberEntries.length;
    return { id: member.id, name: member.name, average: Math.round(average), daysTracked: memberEntries.length };
  });

  const goalReports = goals.map((goal) => {
    const goalRecords = records.filter((record) => record.activity.goalId === goal.id);
    const completed = goalRecords.filter((record) => record.status === "COMPLETED").length;
    return {
      id: goal.id,
      title: goal.title,
      activityCount: goal.activities.length,
      completionRate: goalRecords.length === 0 ? 0 : Math.round((completed / goalRecords.length) * 100),
    };
  });

  const mostActiveMember = [...memberReports].sort((a, b) => b.daysTracked - a.daysTracked)[0];

  return {
    summary: {
      averageCompletion: Math.round(averageCompletion),
      daysTracked: new Set(entries.map((entry) => entry.entryDate.toISOString().slice(0, 10))).size,
      completedRecords: completedRecords.length,
      missedRecords: missedRecords.length,
      mostActiveMember: mostActiveMember?.name ?? "-",
    },
    memberReports,
    goalReports,
  };
}
