"use client";

import Link from "next/link";
import { useActionState } from "react";
import { signUpAction } from "./actions";
import { AuthFormStatus } from "./auth-form-status";

export function RegisterForm() {
  const [state, formAction, isPending] = useActionState(signUpAction, {});

  return (
    <form action={formAction} className="space-y-4">
      <AuthFormStatus error={state.error} message={state.message} />
      <div className="space-y-2">
        <label className="text-sm font-medium" htmlFor="displayName">
          Name
        </label>
        <input
          autoComplete="name"
          className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-neutral-950 dark:border-neutral-700 dark:bg-neutral-950 dark:focus:border-neutral-100"
          id="displayName"
          name="displayName"
          type="text"
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium" htmlFor="email">
          Email
        </label>
        <input
          autoComplete="email"
          className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-neutral-950 dark:border-neutral-700 dark:bg-neutral-950 dark:focus:border-neutral-100"
          id="email"
          name="email"
          required
          type="email"
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium" htmlFor="password">
          Password
        </label>
        <input
          autoComplete="new-password"
          className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-neutral-950 dark:border-neutral-700 dark:bg-neutral-950 dark:focus:border-neutral-100"
          id="password"
          minLength={8}
          name="password"
          required
          type="password"
        />
      </div>
      <button
        className="w-full rounded-lg bg-neutral-950 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-neutral-50 dark:text-neutral-950 dark:hover:bg-neutral-200"
        disabled={isPending}
        type="submit"
      >
        {isPending ? "Creating account..." : "Create account"}
      </button>
      <p className="text-center text-sm text-neutral-600 dark:text-neutral-400">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-neutral-950 dark:text-neutral-100">
          Sign in
        </Link>
      </p>
    </form>
  );
}
