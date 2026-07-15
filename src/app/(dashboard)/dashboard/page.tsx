import { signOutAction } from "@/features/auth/actions";
import { Button } from "@/components/ui";
import { DashboardWidgets } from "@/features/dashboard/dashboard-widgets";
import { getDashboardOverview } from "@/features/dashboard/queries";

export default async function DashboardPage() {
  const overview = await getDashboardOverview();

  return (
    <div className="space-y-6">
      <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-neutral-500">Dashboard</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-normal text-neutral-950 dark:text-neutral-50">
            {overview.family.name} progress overview
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-neutral-600 dark:text-neutral-400">
            Track today's completion, current goals, family ranking, and recent checklist activity.
          </p>
        </div>
        <form action={signOutAction}>
          <Button type="submit" variant="outline">
            Sign out
          </Button>
        </form>
      </section>
      <DashboardWidgets overview={overview} />
    </div>
  );
}
