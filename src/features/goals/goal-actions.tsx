"use client";

import { useActionState } from "react";
import { Alert, Button, Input, Label } from "@/components/ui";
import { deleteGoalAction, updateGoalAction } from "./actions";
import { goalCategories, goalColors } from "./options";

type GoalActionsProps = {
  goal: {
    id: string;
    title: string;
    description: string | null;
    icon: string | null;
    color: string;
    category: string;
    type: string;
    startDate: string;
    endDate: string | null;
  };
};

function toDateInputValue(date: string | null) {
  return date ? date.slice(0, 10) : "";
}

export function GoalActions({ goal }: GoalActionsProps) {
  const [state, formAction, isPending] = useActionState(updateGoalAction, {});

  return (
    <details className="mt-4 rounded-lg border border-sky-100 bg-sky-50/60 p-3 dark:border-sky-900/60 dark:bg-sky-950/20">
      <summary className="cursor-pointer text-sm font-medium text-sky-700 dark:text-sky-300">Edit goal</summary>
      <form action={formAction} className="mt-4 space-y-3">
        <input name="goalId" type="hidden" value={goal.id} />
        <input name="type" type="hidden" value={goal.type} />
        {state.error ? <Alert variant="danger">{state.error}</Alert> : null}
        {state.message ? <Alert variant="success">{state.message}</Alert> : null}
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor={`${goal.id}-title`}>Title</Label>
            <Input defaultValue={goal.title} id={`${goal.id}-title`} name="title" required />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor={`${goal.id}-description`}>Description</Label>
            <Input defaultValue={goal.description ?? ""} id={`${goal.id}-description`} name="description" />
          </div>
          <div className="space-y-2">
            <Label htmlFor={`${goal.id}-category`}>Category</Label>
            <select className="flex h-10 w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-950" defaultValue={goal.category} id={`${goal.id}-category`} name="category">
              {goalCategories.map((category) => <option key={category.value} value={category.value}>{category.label}</option>)}
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor={`${goal.id}-color`}>Color</Label>
            <select className="flex h-10 w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-950" defaultValue={goal.color} id={`${goal.id}-color`} name="color">
              {goalColors.map((color) => <option key={color.value} value={color.value}>{color.label}</option>)}
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor={`${goal.id}-icon`}>Icon label</Label>
            <Input defaultValue={goal.icon ?? ""} id={`${goal.id}-icon`} name="icon" />
          </div>
          <div className="space-y-2">
            <Label htmlFor={`${goal.id}-start`}>Start date</Label>
            <Input defaultValue={toDateInputValue(goal.startDate)} id={`${goal.id}-start`} name="startDate" required type="date" />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor={`${goal.id}-end`}>End date</Label>
            <Input defaultValue={toDateInputValue(goal.endDate)} id={`${goal.id}-end`} name="endDate" type="date" />
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button disabled={isPending} size="sm" type="submit">{isPending ? "Saving..." : "Save changes"}</Button>
        </div>
      </form>
      <form action={deleteGoalAction} className="mt-3">
        <input name="goalId" type="hidden" value={goal.id} />
        <Button size="sm" type="submit" variant="danger">Delete goal</Button>
      </form>
    </details>
  );
}
