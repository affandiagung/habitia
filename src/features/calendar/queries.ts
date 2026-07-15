import { prisma } from "@/lib/prisma/client";
import { getOwnedFamilyId } from "@/features/family/queries";
import { parseChecklistDate, toDatabaseDate, toDateInputValue } from "@/features/checklist/date";

function getMonthBounds(dateValue: string) {
  const date = toDatabaseDate(dateValue);
  const start = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), 1));
  const end = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + 1, 0));
  return { start, end };
}

function dateKey(date: Date) {
  return date.toISOString().slice(0, 10);
}

function statusFromRate(rate: number) {
  if (rate >= 100) return "completed";
  if (rate > 0) return "partial";
  return "missed";
}

export async function getCalendarOverview(date?: string) {
  const familyId = await getOwnedFamilyId();
  const selectedDate = parseChecklistDate(date ?? toDateInputValue());
  const { start, end } = getMonthBounds(selectedDate);
  const selectedDatabaseDate = toDatabaseDate(selectedDate);

  const [entries, selectedEntries] = await Promise.all([
    prisma.dailyEntry.findMany({
      where: { familyId, entryDate: { gte: start, lte: end } },
      include: { member: true },
      orderBy: { entryDate: "asc" },
    }),
    prisma.dailyEntry.findMany({
      where: { familyId, entryDate: selectedDatabaseDate },
      include: { member: true, records: { include: { activity: true } } },
      orderBy: { createdAt: "asc" },
    }),
  ]);

  const daysInMonth = end.getUTCDate();
  const daySummaries = Array.from({ length: daysInMonth }, (_, index) => {
    const day = new Date(Date.UTC(start.getUTCFullYear(), start.getUTCMonth(), index + 1));
    const key = dateKey(day);
    const dayEntries = entries.filter((entry) => dateKey(entry.entryDate) === key);
    const average = dayEntries.length === 0
      ? 0
      : dayEntries.reduce((sum, entry) => sum + Number(entry.completionRate.toString()), 0) / dayEntries.length;

    return {
      date: key,
      dayNumber: index + 1,
      average: Math.round(average),
      status: dayEntries.length === 0 ? "empty" : statusFromRate(average),
    };
  });

  return {
    selectedDate,
    monthLabel: start.toLocaleDateString("en-US", { month: "long", year: "numeric", timeZone: "UTC" }),
    daySummaries,
    selectedEntries: selectedEntries.map((entry) => ({
      id: entry.id,
      memberName: entry.member.name,
      completionRate: entry.completionRate.toString(),
      records: entry.records.map((record) => ({
        id: record.id,
        activityTitle: record.activity.title,
        status: record.status,
      })),
    })),
  };
}
