import { Badge, Card, CardContent } from "@/components/ui";
import { GoalActions } from "./goal-actions";
import { goalColors } from "./options";

type Goal = {
  id: string;
  title: string;
  description: string | null;
  icon: string | null;
  color: string;
  category: string;
  type: string;
  status: string;
  startDate: Date;
  endDate: Date | null;
  activities: { id: string }[];
};

function getColorClass(color: string) {
  return goalColors.find((item) => item.value === color)?.className ?? "bg-slate-500";
}

function formatValue(value: string) {
  return value.toLowerCase().replaceAll("_", " ");
}

export function GoalList({ goals }: { goals: Goal[] }) {
  if (goals.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-sm font-medium text-neutral-950 dark:text-neutral-50">No goals yet</p>
          <p className="mt-2 text-sm text-neutral-500">Create the first goal your family will work on together.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-3 lg:grid-cols-2">
      {goals.map((goal) => (
        <Card key={goal.id}>
          <CardContent className="flex gap-4 p-4">
            <div className={`mt-1 h-11 w-11 shrink-0 rounded-lg ${getColorClass(goal.color)}`} />
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="truncate text-sm font-semibold text-neutral-950 dark:text-neutral-50">{goal.title}</h3>
                <Badge variant={goal.status === "ACTIVE" ? "success" : "muted"}>{formatValue(goal.status)}</Badge>
              </div>
              <p className="mt-1 text-sm leading-6 text-neutral-500">
                {goal.description ?? "No description yet"}
              </p>
              <div className="mt-3 flex flex-wrap gap-2 text-xs text-neutral-500">
                <Badge variant="muted">{formatValue(goal.category)}</Badge>
                <Badge variant="muted">{formatValue(goal.type)}</Badge>
                <Badge variant="muted">{goal.activities.length} activities</Badge>
              </div>
              <p className="mt-3 text-xs text-neutral-400">
                {goal.startDate.toLocaleDateString()} - {goal.endDate ? goal.endDate.toLocaleDateString() : "No end date"}
              </p>
              <GoalActions
                goal={{
                  ...goal,
                  startDate: goal.startDate.toISOString(),
                  endDate: goal.endDate?.toISOString() ?? null,
                }}
              />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
