"use client";

import { useActionState, useState } from "react";
import { Alert, Badge, Button, Input, Label } from "@/components/ui";
import { createGoalAction } from "./actions";
import { goalCategories, goalColors, goalTemplates } from "./options";

function addDays(date: Date, days: number) {
  const next = new Date(date);
  next.setDate(next.getDate() + days - 1);
  return next.toISOString().slice(0, 10);
}

function today() {
  return new Date().toISOString().slice(0, 10);
}

export function CreateGoalForm() {
  const [state, formAction, isPending] = useActionState(createGoalAction, {});
  const [templateIndex, setTemplateIndex] = useState("");
  const selectedTemplate = templateIndex === "" ? null : goalTemplates[Number(templateIndex)];
  const startDate = today();

  return (
    <form action={formAction} className="space-y-4">
      {state.error ? <Alert variant="danger">{state.error}</Alert> : null}
      {state.message ? <Alert variant="success">{state.message}</Alert> : null}

      <div className="space-y-2">
        <Label htmlFor="goal-template">Start from template</Label>
        <select
          className="flex h-10 w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-950 outline-none transition focus:border-neutral-950 focus-visible:ring-2 focus-visible:ring-neutral-950 focus-visible:ring-offset-2 dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-50 dark:focus:border-neutral-100"
          id="goal-template"
          onChange={(event) => setTemplateIndex(event.target.value)}
          value={templateIndex}
        >
          <option value="">Custom goal</option>
          {goalTemplates.map((template, index) => (
            <option key={template.title} value={index}>
              {template.title}
            </option>
          ))}
        </select>
      </div>

      {selectedTemplate ? (
        <Alert>
          <span className="font-medium">Template selected:</span> {selectedTemplate.title}. You can edit every field before saving.
        </Alert>
      ) : null}

      <input name="type" type="hidden" value={selectedTemplate ? "TEMPLATE" : "CUSTOM"} />

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="goal-title">Title</Label>
          <Input
            defaultValue={selectedTemplate?.title ?? ""}
            id="goal-title"
            key={`title-${selectedTemplate?.title ?? "custom"}`}
            name="title"
            required
          />
        </div>
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="goal-description">Description</Label>
          <Input id="goal-description" name="description" placeholder="What should this goal help your family build?" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="goal-category">Category</Label>
          <select
            className="flex h-10 w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-950 outline-none transition focus:border-neutral-950 focus-visible:ring-2 focus-visible:ring-neutral-950 focus-visible:ring-offset-2 dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-50 dark:focus:border-neutral-100"
            defaultValue={selectedTemplate?.category ?? "CUSTOM"}
            id="goal-category"
            key={`category-${selectedTemplate?.title ?? "custom"}`}
            name="category"
          >
            {goalCategories.map((category) => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="goal-color">Color</Label>
          <select
            className="flex h-10 w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-950 outline-none transition focus:border-neutral-950 focus-visible:ring-2 focus-visible:ring-neutral-950 focus-visible:ring-offset-2 dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-50 dark:focus:border-neutral-100"
            defaultValue={selectedTemplate?.color ?? "slate"}
            id="goal-color"
            key={`color-${selectedTemplate?.title ?? "custom"}`}
            name="color"
          >
            {goalColors.map((color) => (
              <option key={color.value} value={color.value}>
                {color.label}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="goal-icon">Icon label</Label>
          <Input
            defaultValue={selectedTemplate?.icon ?? ""}
            id="goal-icon"
            key={`icon-${selectedTemplate?.title ?? "custom"}`}
            name="icon"
            placeholder="Target"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="goal-start-date">Start date</Label>
          <Input defaultValue={startDate} id="goal-start-date" name="startDate" required type="date" />
        </div>
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="goal-end-date">End date</Label>
          <Input
            defaultValue={selectedTemplate ? addDays(new Date(), selectedTemplate.durationDays) : ""}
            id="goal-end-date"
            key={`end-${selectedTemplate?.title ?? "custom"}`}
            name="endDate"
            type="date"
          />
        </div>
      </div>

      <div className="flex items-center justify-between gap-3">
        <Badge variant="muted">Activities are added in Step 10</Badge>
        <Button disabled={isPending} type="submit">
          {isPending ? "Creating..." : "Create goal"}
        </Button>
      </div>
    </form>
  );
}
