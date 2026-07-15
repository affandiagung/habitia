"use client";

import Link from "next/link";
import { useActionState } from "react";
import { Button, Input, Label } from "@/components/ui";
import { updatePasswordAction } from "./actions";
import { AuthFormStatus } from "./auth-form-status";

export function ResetPasswordForm() {
  const [state, formAction, isPending] = useActionState(updatePasswordAction, {});

  return (
    <form action={formAction} className="space-y-4">
      <AuthFormStatus error={state.error} message={state.message} />
      <div className="space-y-2">
        <Label htmlFor="password">
          New password
        </Label>
        <Input
          autoComplete="new-password"
          id="password"
          minLength={8}
          name="password"
          required
          type="password"
        />
      </div>
      <Button className="w-full" disabled={isPending} type="submit">
        {isPending ? "Updating password..." : "Update password"}
      </Button>
      {state.message ? (
        <p className="text-center text-sm text-neutral-600 dark:text-neutral-400">
          <Link href="/dashboard" className="font-medium text-neutral-950 dark:text-neutral-100">
            Continue to dashboard
          </Link>
        </p>
      ) : null}
    </form>
  );
}
