"use client";

import { useActionState, useMemo, useState } from "react";
import { Alert, Badge, Button, Input, Label } from "@/components/ui";
import { createActivityAction } from "./actions";
import { activityTypes, defaultUnitsByType } from "./options";

type GoalOption = {
  id: string;
  title: string;
};

export function CreateActivityForm({ goals }: { goals: GoalOption[] }) {
  const [state, formAction, isPending] = useActionState(createActivityAction, {});
  const [type, setType] = useState<(typeof activityTypes)[number]["value"]>("CHECKBOX");
  const selectedType = useMemo(() => activityTypes.find((item) => item.value === type), [type]);
  const needsTarget = ["NUMBER", "DURATION", "DISTANCE", "RATING"].includes(type);

  if (goals.length === 0) {
    return (
      <Alert>
        Create a goal first. Activities need a goal container before they can be added.
      </Alert>
    );
  }

  return (
    <form action={formAction} className="space-y-4">
      {state.error ? <Alert variant="danger">{state.error}</Alert> : null}
      {state.message ? <Alert variant="success">{state.message}</Alert> : null}

      <div className="space-y-2">
        <Label htmlFor="activity-goal">Goal</Label>
        <select
          className="flex h-10 w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-950 outline-none transition focus:border-neutral-950 focus-visible:ring-2 focus-visible:ring-neutral-950 focus-visible:ring-offset-2 dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-50 dark:focus:border-neutral-100"
          id="activity-goal"
          name="goalId"
          required
        >
          {goals.map((goal) => (
            <option key={goal.id} value={goal.id}>
              {goal.title}
            </option>
          ))}
        </select>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="activity-title">Title</Label>
          <Input id="activity-title" name="title" required />
        </div>
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="activity-description">Description</Label>
          <Input id="activity-description" name="description" placeholder="Optional details or instructions" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="activity-type">Type</Label>
          <select
            className="flex h-10 w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-950 outline-none transition focus:border-neutral-950 focus-visible:ring-2 focus-visible:ring-neutral-950 focus-visible:ring-offset-2 dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-50 dark:focus:border-neutral-100"
            id="activity-type"
            name="type"
            onChange={(event) => setType(event.target.value as typeof type)}
            value={type}
          >
            {activityTypes.map((activityType) => (
              <option key={activityType.value} value={activityType.value}>
                {activityType.label}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="activity-target">Target value</Label>
          <Input
            id="activity-target"
            min={needsTarget ? 1 : undefined}
            name="targetValue"
            placeholder={needsTarget ? "30" : "Optional"}
            required={needsTarget}
            step="0.01"
            type="number"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="activity-unit">Target unit</Label>
          <Input
            defaultValue={defaultUnitsByType[type]}
            id="activity-unit"
            key={`unit-${type}`}
            name="targetUnit"
            placeholder={selectedType?.unitHint ?? "Optional"}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="activity-sort">Sort order</Label>
          <Input defaultValue={0} id="activity-sort" min={0} name="sortOrder" type="number" />
        </div>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-2">
          <Label htmlFor="activity-required">Completion rule</Label>
          <select
            className="flex h-10 w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-950 outline-none transition focus:border-neutral-950 focus-visible:ring-2 focus-visible:ring-neutral-950 focus-visible:ring-offset-2 dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-50 dark:focus:border-neutral-100 sm:w-52"
            defaultValue="true"
            id="activity-required"
            name="isRequired"
          >
            <option value="true">Required</option>
            <option value="false">Optional</option>
          </select>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="muted">Recorded in Step 11</Badge>
          <Button disabled={isPending} type="submit">
            {isPending ? "Creating..." : "Create activity"}
          </Button>
        </div>
      </div>
    </form>
  );
}
