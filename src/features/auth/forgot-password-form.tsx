"use client";

import Link from "next/link";
import { useActionState } from "react";
import { Button, Input, Label } from "@/components/ui";
import { requestPasswordResetAction } from "./actions";
import { AuthFormStatus } from "./auth-form-status";

export function ForgotPasswordForm() {
  const [state, formAction, isPending] = useActionState(requestPasswordResetAction, {});

  return (
    <form action={formAction} className="space-y-4">
      <AuthFormStatus error={state.error} message={state.message} />
      <div className="space-y-2">
        <Label htmlFor="email">
          Email
        </Label>
        <Input
          autoComplete="email"
          id="email"
          name="email"
          required
          type="email"
        />
      </div>
      <Button className="w-full" disabled={isPending} type="submit">
        {isPending ? "Sending link..." : "Send reset link"}
      </Button>
      <p className="text-center text-sm text-neutral-600 dark:text-neutral-400">
        <Link href="/login" className="font-medium text-neutral-950 dark:text-neutral-100">
          Back to sign in
        </Link>
      </p>
    </form>
  );
}
