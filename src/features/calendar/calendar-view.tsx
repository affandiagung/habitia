import Link from "next/link";
import { Badge, Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui";

type CalendarOverview = Awaited<ReturnType<typeof import("./queries").getCalendarOverview>>;

const statusClass: Record<string, string> = {
  completed: "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300",
  partial: "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-300",
  missed: "border-red-200 bg-red-50 text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300",
  empty: "border-neutral-200 bg-white text-neutral-500 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-400",
};

export function CalendarView({ overview }: { overview: CalendarOverview }) {
  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
      <Card>
        <CardHeader>
          <CardTitle>{overview.monthLabel}</CardTitle>
          <CardDescription>Green completed, yellow partial, red missed, gray no record.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-2">
            {overview.daySummaries.map((day) => (
              <Link
                className={`min-h-20 rounded-lg border p-2 text-sm transition hover:scale-[1.01] ${statusClass[day.status]}`}
                href={`/calendar?date=${day.date}`}
                key={day.date}
              >
                <span className="font-semibold">{day.dayNumber}</span>
                <p className="mt-3 text-xs">{day.average}%</p>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{overview.selectedDate}</CardTitle>
          <CardDescription>Detailed records for selected date.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {overview.selectedEntries.length === 0 ? <p className="text-sm text-neutral-500">No records for this date.</p> : null}
          {overview.selectedEntries.map((entry) => (
            <div className="space-y-2 rounded-lg border border-neutral-200 p-3 dark:border-neutral-800" key={entry.id}>
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-medium text-neutral-950 dark:text-neutral-50">{entry.memberName}</p>
                <Badge variant="muted">{entry.completionRate}%</Badge>
              </div>
              {entry.records.map((record) => (
                <div className="flex items-center justify-between gap-2 text-xs text-neutral-500" key={record.id}>
                  <span>{record.activityTitle}</span>
                  <span>{record.status.toLowerCase()}</span>
                </div>
              ))}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
