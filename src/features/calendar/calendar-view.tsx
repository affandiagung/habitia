"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Badge, Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui";

type CalendarOverview = Awaited<ReturnType<typeof import("./queries").getCalendarOverview>>;

const statusClass: Record<string, string> = {
  completed: "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300",
  partial: "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-300",
  missed: "border-red-200 bg-red-50 text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300",
  empty: "border-neutral-200 bg-white text-neutral-500 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-400",
};

const weekdayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function CalendarView({ overview, onDateSelect }: { overview: CalendarOverview; onDateSelect?: (date: string) => void }) {
  const leadingBlankDays = Array.from({ length: overview.firstWeekday }, (_, index) => `blank-start-${index}`);
  const occupiedCells = leadingBlankDays.length + overview.daySummaries.length;
  const trailingBlankDays = Array.from({ length: Math.ceil(occupiedCells / 7) * 7 - occupiedCells }, (_, index) => `blank-end-${index}`);

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <CardTitle>{overview.monthLabel}</CardTitle>
              <CardDescription>Green completed, yellow partial, red missed, gray no record.</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button
                aria-label="Previous month"
                onClick={() => onDateSelect?.(overview.previousMonthDate)}
                size="icon"
                type="button"
                variant="outline"
              >
                <ChevronLeft aria-hidden="true" className="h-4 w-4" />
              </Button>
              <Button
                aria-label="Next month"
                onClick={() => onDateSelect?.(overview.nextMonthDate)}
                size="icon"
                type="button"
                variant="outline"
              >
                <ChevronRight aria-hidden="true" className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-2 grid grid-cols-7 gap-2">
            {weekdayLabels.map((weekday) => (
              <div className="px-2 text-center text-xs font-semibold uppercase tracking-wide text-neutral-500" key={weekday}>
                {weekday}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-2">
            {leadingBlankDays.map((key) => (
              <div aria-hidden="true" className="min-h-20 rounded-lg border border-dashed border-neutral-100 bg-neutral-50/70 dark:border-neutral-900 dark:bg-neutral-950" key={key} />
            ))}
            {overview.daySummaries.map((day) => (
              <button
                className={`min-h-20 rounded-lg border p-2 text-left text-sm transition hover:scale-[1.01] ${statusClass[day.status]} ${day.date === overview.selectedDate ? "ring-2 ring-sky-500 ring-offset-2 dark:ring-offset-neutral-950" : ""}`}
                key={day.date}
                onClick={() => onDateSelect?.(day.date)}
                type="button"
              >
                <span className="font-semibold">{day.dayNumber}</span>
                <p className="mt-3 text-xs">{day.average}%</p>
              </button>
            ))}
            {trailingBlankDays.map((key) => (
              <div aria-hidden="true" className="min-h-20 rounded-lg border border-dashed border-neutral-100 bg-neutral-50/70 dark:border-neutral-900 dark:bg-neutral-950" key={key} />
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
