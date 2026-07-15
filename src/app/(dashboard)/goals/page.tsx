import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui";
import { CreateGoalForm } from "@/features/goals/create-goal-form";
import { GoalList } from "@/features/goals/goal-list";
import { getGoalsOverview } from "@/features/goals/queries";

export default async function GoalsPage() {
  const { goals } = await getGoalsOverview();

  return (
    <div className="space-y-6">
      <section>
        <p className="text-sm font-medium uppercase tracking-[0.18em] text-neutral-500">Goals</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-normal text-neutral-950 dark:text-neutral-50">
          Family goals
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-neutral-600 dark:text-neutral-400">
          Create goal containers for habits and challenges. Activities will be attached in the next step.
        </p>
      </section>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_420px]">
        <section className="space-y-3">
          <div>
            <h2 className="text-lg font-semibold tracking-normal text-neutral-950 dark:text-neutral-50">
              Current goals
            </h2>
            <p className="mt-1 text-sm text-neutral-500">{goals.length} goal(s) created.</p>
          </div>
          <GoalList goals={goals} />
        </section>

        <Card>
          <CardHeader>
            <CardTitle>Create goal</CardTitle>
            <CardDescription>Start custom or use a template preset. Every goal remains editable later.</CardDescription>
          </CardHeader>
          <CardContent>
            <CreateGoalForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
