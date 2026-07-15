"use client";

import { useActionState } from "react";
import { Alert, Button, Input, Label } from "@/components/ui";
import { addFamilyMemberAction } from "./actions";
import { familyMemberRoles, genderOptions, memberColorOptions } from "./options";

export function AddFamilyMemberForm() {
  const [state, formAction, isPending] = useActionState(addFamilyMemberAction, {});

  return (
    <form action={formAction} className="space-y-4">
      {state.error ? <Alert variant="danger">{state.error}</Alert> : null}
      {state.message ? <Alert variant="success">{state.message}</Alert> : null}

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="member-name">Name</Label>
          <Input id="member-name" name="name" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="member-nickname">Nickname</Label>
          <Input id="member-nickname" name="nickname" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="member-role">Role</Label>
          <select
            className="flex h-10 w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-950 outline-none transition focus:border-neutral-950 focus-visible:ring-2 focus-visible:ring-neutral-950 focus-visible:ring-offset-2 dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-50 dark:focus:border-neutral-100"
            defaultValue="OTHER"
            id="member-role"
            name="role"
          >
            {familyMemberRoles.map((role) => (
              <option key={role.value} value={role.value}>
                {role.label}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="member-gender">Gender</Label>
          <select
            className="flex h-10 w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-950 outline-none transition focus:border-neutral-950 focus-visible:ring-2 focus-visible:ring-neutral-950 focus-visible:ring-offset-2 dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-50 dark:focus:border-neutral-100"
            defaultValue=""
            id="member-gender"
            name="gender"
          >
            {genderOptions.map((gender) => (
              <option key={gender.value || "empty"} value={gender.value}>
                {gender.label}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="member-birth-date">Birth date</Label>
          <Input id="member-birth-date" name="birthDate" type="date" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="member-color">Color theme</Label>
          <select
            className="flex h-10 w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-950 outline-none transition focus:border-neutral-950 focus-visible:ring-2 focus-visible:ring-neutral-950 focus-visible:ring-offset-2 dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-50 dark:focus:border-neutral-100"
            defaultValue="slate"
            id="member-color"
            name="colorTheme"
          >
            {memberColorOptions.map((color) => (
              <option key={color.value} value={color.value}>
                {color.label}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="member-avatar">Avatar URL</Label>
          <Input id="member-avatar" name="avatarUrl" placeholder="https://..." type="url" />
        </div>
      </div>

      <Button disabled={isPending} type="submit">
        {isPending ? "Adding..." : "Add member"}
      </Button>
    </form>
  );
}
