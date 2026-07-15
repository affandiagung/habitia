import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui";
import { ActivityRecordForm } from "./activity-record-form";

type Activity = {
  id: string;
  title: string;
  type: string;
  targetValue: string | null;
  targetUnit: string | null;
};

type Goal = {
  id: string;
  title: string;
  activities: Activity[];
};

type Member = {
  id: string;
  name: string;
  nickname: string | null;
};

type DailyEntry = {
  memberId: string;
  completionRate: string;
  records: Array<{
    activityId: string;
    status: string;
    booleanValue: boolean | null;
    numberValue: string | null;
    textValue: string | null;
    ratingValue: number | null;
  }>;
};

export function MemberChecklist({
  members,
  goals,
  entries,
  entryDate,
}: {
  members: Member[];
  goals: Goal[];
  entries: DailyEntry[];
  entryDate: string;
}) {
  const activities = goals.flatMap((goal) => goal.activities.map((activity) => ({ ...activity, goalTitle: goal.title })));

  if (members.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-sm font-medium text-neutral-950 dark:text-neutral-50">No family members yet</p>
          <p className="mt-2 text-sm text-neutral-500">Add family members before recording daily progress.</p>
        </CardContent>
      </Card>
    );
  }

  if (activities.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-sm font-medium text-neutral-950 dark:text-neutral-50">No active activities yet</p>
          <p className="mt-2 text-sm text-neutral-500">Create goals and activities before using the daily checklist.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-5">
      {members.map((member) => {
        const entry = entries.find((item) => item.memberId === member.id);

        return (
          <Card key={member.id}>
            <CardHeader>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <CardTitle>{member.name}</CardTitle>
                  <CardDescription>{member.nickname ?? "Family member"}</CardDescription>
                </div>
                <p className="text-sm font-semibold text-neutral-950 dark:text-neutral-50">
                  {entry?.completionRate ?? "0"}% complete
                </p>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {goals.map((goal) =>
                goal.activities.length > 0 ? (
                  <section className="space-y-3" key={`${member.id}-${goal.id}`}>
                    <h3 className="text-sm font-semibold text-neutral-950 dark:text-neutral-50">{goal.title}</h3>
                    <div className="grid gap-3 lg:grid-cols-2">
                      {goal.activities.map((activity) => (
                        <ActivityRecordForm
                          activity={activity}
                          entryDate={entryDate}
                          key={`${member.id}-${activity.id}`}
                          memberId={member.id}
                          record={entry?.records.find((record) => record.activityId === activity.id)}
                        />
                      ))}
                    </div>
                  </section>
                ) : null,
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
