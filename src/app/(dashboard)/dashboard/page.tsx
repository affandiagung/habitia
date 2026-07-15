import { signOutAction } from "@/features/auth/actions";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-neutral-500">Dashboard</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-normal text-neutral-950 dark:text-neutral-50">
            Family progress overview
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-neutral-600 dark:text-neutral-400">
            Layout is ready. The dashboard widgets will be implemented in the dashboard step.
          </p>
        </div>
        <form action={signOutAction}>
          <button
            className="rounded-lg border border-neutral-300 bg-white px-4 py-2 text-sm font-medium transition hover:bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-900 dark:hover:bg-neutral-800"
            type="submit"
          >
            Sign out
          </button>
        </form>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {["Today's progress", "Active goals", "Family completion"].map((title) => (
          <div
            className="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900"
            key={title}
          >
            <p className="text-sm font-medium text-neutral-500">{title}</p>
            <p className="mt-3 text-2xl font-semibold text-neutral-950 dark:text-neutral-50">--</p>
            <p className="mt-2 text-sm text-neutral-500">Coming in a later step</p>
          </div>
        ))}
      </section>
    </div>
  );
}
