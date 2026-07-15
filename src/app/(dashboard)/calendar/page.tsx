import { CalendarView } from "@/features/calendar/calendar-view";
import { getCalendarOverview } from "@/features/calendar/queries";

type CalendarPageProps = { searchParams: Promise<{ date?: string }> };

export default async function CalendarPage({ searchParams }: CalendarPageProps) {
  const { date } = await searchParams;
  const overview = await getCalendarOverview(date);

  return (
    <div className="space-y-6">
      <section>
        <p className="text-sm font-medium uppercase tracking-[0.18em] text-neutral-500">Calendar</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-normal text-neutral-950 dark:text-neutral-50">
          Historical progress calendar
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-neutral-600 dark:text-neutral-400">
          Review completion history by date and inspect member records for each day.
        </p>
      </section>
      <CalendarView overview={overview} />
    </div>
  );
}
