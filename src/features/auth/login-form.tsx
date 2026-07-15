"use client";

import Link from "next/link";
import { useActionState } from "react";
import { Button, Input, Label } from "@/components/ui";
import { signInAction } from "./actions";
import { AuthFormStatus } from "./auth-form-status";

type LoginFormProps = {
  next?: string;
};

export function LoginForm({ next = "/dashboard" }: LoginFormProps) {
  const [state, formAction, isPending] = useActionState(signInAction, {});

  return (
    <form action={formAction} className="space-y-4">
      <input name="next" type="hidden" value={next} />
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
      <div className="space-y-2">
        <Label htmlFor="password">
          Password
        </Label>
        <Input
          autoComplete="current-password"
          id="password"
          name="password"
          required
          type="password"
        />
      </div>
      <Button className="w-full" disabled={isPending} type="submit">
        {isPending ? "Signing in..." : "Sign in"}
      </Button>
      <div className="flex items-center justify-between text-sm text-neutral-600 dark:text-neutral-400">
        <Link href="/forgot-password" className="hover:text-neutral-950 dark:hover:text-neutral-100">
          Forgot password?
        </Link>
        <Link href="/register" className="hover:text-neutral-950 dark:hover:text-neutral-100">
          Create account
        </Link>
      </div>
    </form>
  );
}
