"use client";

import Link from "next/link";
import { useActionState } from "react";
import { Button, Input, Label } from "@/components/ui";
import { signUpAction } from "./actions";
import { AuthFormStatus } from "./auth-form-status";

export function RegisterForm() {
  const [state, formAction, isPending] = useActionState(signUpAction, {});

  return (
    <form action={formAction} className="space-y-4">
      <AuthFormStatus error={state.error} message={state.message} />
      <div className="space-y-2">
        <Label htmlFor="displayName">
          Name
        </Label>
        <Input
          autoComplete="name"
          id="displayName"
          name="displayName"
          type="text"
        />
      </div>
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
      <div className="space-y-2">
        <Label htmlFor="password">
          Password
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
        {isPending ? "Creating account..." : "Create account"}
      </Button>
      <p className="text-center text-sm text-neutral-600 dark:text-neutral-400">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-neutral-950 dark:text-neutral-100">
          Sign in
        </Link>
      </p>
    </form>
  );
}
