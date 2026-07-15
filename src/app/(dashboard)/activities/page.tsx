import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui";
import { ActivityList } from "@/features/activities/activity-list";
import { CreateActivityForm } from "@/features/activities/create-activity-form";
import { getActivitiesOverview } from "@/features/activities/queries";

export default async function ActivitiesPage() {
  const { goals } = await getActivitiesOverview();
  const goalOptions = goals.map((goal) => ({ id: goal.id, title: goal.title }));
  const activityCount = goals.reduce((total, goal) => total + goal.activities.length, 0);

  return (
    <div className="space-y-6">
      <section>
        <p className="text-sm font-medium uppercase tracking-[0.18em] text-neutral-500">Activities</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-normal text-neutral-950 dark:text-neutral-50">
          Goal activities
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-neutral-600 dark:text-neutral-400">
          Define the specific actions that make each family goal measurable. Daily recording starts in the checklist step.
        </p>
      </section>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_420px]">
        <section className="space-y-3">
          <div>
            <h2 className="text-lg font-semibold tracking-normal text-neutral-950 dark:text-neutral-50">
              Activity library
            </h2>
            <p className="mt-1 text-sm text-neutral-500">{activityCount} activity item(s) across {goals.length} goal(s).</p>
          </div>
          <ActivityList goals={goals} />
        </section>

        <Card>
          <CardHeader>
            <CardTitle>Create activity</CardTitle>
            <CardDescription>Attach an activity to a goal and choose how it should be measured.</CardDescription>
          </CardHeader>
          <CardContent>
            <CreateActivityForm goals={goalOptions} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
