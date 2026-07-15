"use client";

import { useActionState } from "react";
import { Alert, Button, Input, Label } from "@/components/ui";
import { updateFamilyAction } from "./actions";
import { timezoneOptions } from "./options";

type FamilyProfileFormProps = {
  family: {
    name: string;
    description: string | null;
    avatarUrl: string | null;
    timezone: string;
  };
};

export function FamilyProfileForm({ family }: FamilyProfileFormProps) {
  const [state, formAction, isPending] = useActionState(updateFamilyAction, {});

  return (
    <form action={formAction} className="space-y-4">
      {state.error ? <Alert variant="danger">{state.error}</Alert> : null}
      {state.message ? <Alert variant="success">{state.message}</Alert> : null}

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="family-name">Family name</Label>
          <Input defaultValue={family.name} id="family-name" name="name" required />
        </div>
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="family-description">Description</Label>
          <Input
            defaultValue={family.description ?? ""}
            id="family-description"
            name="description"
            placeholder="A short note about your family"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="family-avatar">Avatar URL</Label>
          <Input
            defaultValue={family.avatarUrl ?? ""}
            id="family-avatar"
            name="avatarUrl"
            placeholder="https://..."
            type="url"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="family-timezone">Timezone</Label>
          <select
            className="flex h-10 w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-950 outline-none transition focus:border-neutral-950 focus-visible:ring-2 focus-visible:ring-neutral-950 focus-visible:ring-offset-2 dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-50 dark:focus:border-neutral-100"
            defaultValue={family.timezone}
            id="family-timezone"
            name="timezone"
          >
            {timezoneOptions.map((timezone) => (
              <option key={timezone} value={timezone}>
                {timezone}
              </option>
            ))}
          </select>
        </div>
      </div>

      <Button disabled={isPending} type="submit">
        {isPending ? "Saving..." : "Save family"}
      </Button>
    </form>
  );
}
