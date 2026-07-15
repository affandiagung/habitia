import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui";

type ReportsOverview = Awaited<ReturnType<typeof import("./queries").getReportsOverview>>;

export function ReportView({ overview }: { overview: ReportsOverview }) {
  const stats = [
    { label: "Average completion", value: `${overview.summary.averageCompletion}%` },
    { label: "Days tracked", value: overview.summary.daysTracked },
    { label: "Completed records", value: overview.summary.completedRecords },
    { label: "Missed records", value: overview.summary.missedRecords },
    { label: "Most active member", value: overview.summary.mostActiveMember },
  ];

  return (
    <div className="space-y-6">
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-5">
              <p className="text-sm font-medium text-neutral-500">{stat.label}</p>
              <p className="mt-3 text-2xl font-semibold text-neutral-950 dark:text-neutral-50">{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Member report</CardTitle>
            <CardDescription>Average completion and tracked days.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {overview.memberReports.map((member) => (
              <div className="space-y-2" key={member.id}>
                <div className="flex justify-between text-sm">
                  <span className="font-medium text-neutral-950 dark:text-neutral-50">{member.name}</span>
                  <span className="text-neutral-500">{member.average}% / {member.daysTracked} days</span>
                </div>
                <div className="h-2 rounded-full bg-neutral-100 dark:bg-neutral-800">
                  <div className="h-2 rounded-full bg-neutral-950 dark:bg-neutral-50" style={{ width: `${member.average}%` }} />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Goal report</CardTitle>
            <CardDescription>Completion based on recorded activity rows.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {overview.goalReports.map((goal) => (
              <div className="rounded-lg border border-neutral-200 p-3 dark:border-neutral-800" key={goal.id}>
                <div className="flex justify-between gap-3 text-sm">
                  <span className="font-medium text-neutral-950 dark:text-neutral-50">{goal.title}</span>
                  <span className="text-neutral-500">{goal.completionRate}%</span>
                </div>
                <p className="mt-1 text-xs text-neutral-500">{goal.activityCount} activities</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
