import { Badge, Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui";

type DashboardOverview = Awaited<ReturnType<typeof import("./queries").getDashboardOverview>>;

function formatStatus(value: string) {
  return value.toLowerCase().replaceAll("_", " ");
}

export function DashboardWidgets({ overview }: { overview: DashboardOverview }) {
  const stats = [
    { label: "Today's progress", value: `${overview.stats.todayCompletion}%`, helper: "Average family completion" },
    { label: "Active goals", value: overview.stats.activeGoalCount, helper: `${overview.stats.activityCount} activities total` },
    { label: "Required activities", value: overview.stats.requiredActivityCount, helper: `${overview.stats.completedRecordCount} completed today` },
  ];

  return (
    <div className="space-y-6">
      <section className="grid gap-4 md:grid-cols-3">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-5">
              <p className="text-sm font-medium text-neutral-500">{stat.label}</p>
              <p className="mt-3 text-3xl font-semibold text-neutral-950 dark:text-neutral-50">{stat.value}</p>
              <p className="mt-2 text-sm text-neutral-500">{stat.helper}</p>
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <Card>
          <CardHeader>
            <CardTitle>Current goals</CardTitle>
            <CardDescription>Most recent goals in this family workspace.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {overview.goals.length === 0 ? <p className="text-sm text-neutral-500">No goals yet.</p> : null}
            {overview.goals.map((goal) => (
              <div className="flex items-center justify-between gap-3 rounded-lg border border-neutral-200 p-3 dark:border-neutral-800" key={goal.id}>
                <div>
                  <p className="text-sm font-medium text-neutral-950 dark:text-neutral-50">{goal.title}</p>
                  <p className="mt-1 text-xs text-neutral-500">{goal.activityCount} activities</p>
                </div>
                <Badge variant={goal.status === "ACTIVE" ? "success" : "muted"}>{formatStatus(goal.status)}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Family ranking</CardTitle>
            <CardDescription>Today's completion by member.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {overview.members.map((member) => (
              <div className="space-y-2" key={member.id}>
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-neutral-950 dark:text-neutral-50">{member.name}</span>
                  <span className="text-neutral-500">{member.completionRate}%</span>
                </div>
                <div className="h-2 rounded-full bg-neutral-100 dark:bg-neutral-800">
                  <div className="h-2 rounded-full bg-neutral-950 dark:bg-neutral-50" style={{ width: `${Number(member.completionRate)}%` }} />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>

      <Card>
        <CardHeader>
          <CardTitle>Recent activity</CardTitle>
          <CardDescription>Latest checklist updates.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {overview.recentRecords.length === 0 ? <p className="text-sm text-neutral-500">No activity recorded yet.</p> : null}
          {overview.recentRecords.map((record) => (
            <div className="flex items-center justify-between gap-3 text-sm" key={record.id}>
              <span className="text-neutral-700 dark:text-neutral-300">{record.memberName} updated {record.activityTitle}</span>
              <Badge variant={record.status === "COMPLETED" ? "success" : "muted"}>{formatStatus(record.status)}</Badge>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
