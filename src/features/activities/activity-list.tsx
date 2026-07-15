import { Badge, Card, CardContent } from "@/components/ui";

type Activity = {
  id: string;
  title: string;
  description: string | null;
  type: string;
  targetValue: string | null;
  targetUnit: string | null;
  sortOrder: number;
  isRequired: boolean;
};

type GoalWithActivities = {
  id: string;
  title: string;
  activities: Activity[];
};

function formatValue(value: string) {
  return value.toLowerCase().replaceAll("_", " ");
}

function formatTarget(activity: Activity) {
  if (activity.targetValue == null) {
    return "No numeric target";
  }

  return `${activity.targetValue}${activity.targetUnit ? ` ${activity.targetUnit}` : ""}`;
}

export function ActivityList({ goals }: { goals: GoalWithActivities[] }) {
  const activityCount = goals.reduce((total, goal) => total + goal.activities.length, 0);

  if (activityCount === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-sm font-medium text-neutral-950 dark:text-neutral-50">No activities yet</p>
          <p className="mt-2 text-sm text-neutral-500">Create activities inside a goal to define daily actions.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {goals.map((goal) =>
        goal.activities.length > 0 ? (
          <section className="space-y-3" key={goal.id}>
            <div>
              <h3 className="text-sm font-semibold text-neutral-950 dark:text-neutral-50">{goal.title}</h3>
              <p className="mt-1 text-xs text-neutral-500">{goal.activities.length} activity item(s)</p>
            </div>
            <div className="grid gap-3 lg:grid-cols-2">
              {goal.activities.map((activity) => (
                <Card key={activity.id}>
                  <CardContent className="p-4">
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="text-sm font-semibold text-neutral-950 dark:text-neutral-50">{activity.title}</h4>
                      <Badge variant="muted">{formatValue(activity.type)}</Badge>
                      <Badge variant={activity.isRequired ? "warning" : "muted"}>
                        {activity.isRequired ? "required" : "optional"}
                      </Badge>
                    </div>
                    <p className="mt-2 text-sm leading-6 text-neutral-500">
                      {activity.description ?? "No description yet"}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2 text-xs text-neutral-500">
                      <Badge variant="muted">Target: {formatTarget(activity)}</Badge>
                      <Badge variant="muted">Order: {activity.sortOrder}</Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        ) : null,
      )}
    </div>
  );
}
