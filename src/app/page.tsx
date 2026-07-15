import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-12">
      <section className="max-w-2xl text-center">
        <p className="mb-3 text-sm font-medium uppercase tracking-[0.18em] text-neutral-500">
          Habitia
        </p>
        <h1 className="text-4xl font-semibold text-neutral-950 dark:text-neutral-50 sm:text-5xl">
          Family goals, habits, and daily progress in one calm workspace.
        </h1>
        <p className="mt-5 text-base leading-7 text-neutral-600 dark:text-neutral-300 sm:text-lg">
          Project setup is ready. The product will be built incrementally with
          approval before each feature.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link className="rounded-lg bg-neutral-950 px-4 py-2.5 text-sm font-medium text-white dark:bg-neutral-50 dark:text-neutral-950" href="/login">
            Sign in
          </Link>
          <Link className="rounded-lg border border-neutral-300 px-4 py-2.5 text-sm font-medium dark:border-neutral-700" href="/register">
            Create account
          </Link>
        </div>
      </section>
    </main>
  );
}
