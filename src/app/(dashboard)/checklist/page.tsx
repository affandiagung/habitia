import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui";
import { ChecklistDateForm } from "@/features/checklist/checklist-date-form";
import { parseChecklistDate } from "@/features/checklist/date";
import { MemberChecklist } from "@/features/checklist/member-checklist";
import { getChecklistOverview } from "@/features/checklist/queries";

type ChecklistPageProps = {
  searchParams: Promise<{ date?: string }>;
};

export default async function ChecklistPage({ searchParams }: ChecklistPageProps) {
  const { date } = await searchParams;
  const entryDate = parseChecklistDate(date);
  const { family } = await getChecklistOverview(entryDate);
  const activityCount = family.goals.reduce((total, goal) => total + goal.activities.length, 0);

  return (
    <div className="space-y-6">
      <section className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-neutral-500">Daily Checklist</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-normal text-neutral-950 dark:text-neutral-50">
            Record daily progress
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-neutral-600 dark:text-neutral-400">
            Update progress for each family member across active goals and activities.
          </p>
        </div>
        <Card className="w-full lg:w-80">
          <CardContent className="p-4">
            <ChecklistDateForm date={entryDate} />
          </CardContent>
        </Card>
      </section>

      <Card>
        <CardHeader>
          <CardTitle>Checklist summary</CardTitle>
          <CardDescription>
            {family.members.length} member(s), {family.goals.length} active goal(s), {activityCount} activity item(s).
          </CardDescription>
        </CardHeader>
      </Card>

      <MemberChecklist
        entries={family.dailyEntries}
        entryDate={entryDate}
        goals={family.goals}
        members={family.members}
      />
    </div>
  );
}
