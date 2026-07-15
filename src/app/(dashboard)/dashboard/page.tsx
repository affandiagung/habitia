import { signOutAction } from "@/features/auth/actions";
import { Button, Card, CardContent } from "@/components/ui";

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
          <Button type="submit" variant="outline">
            Sign out
          </Button>
        </form>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {["Today's progress", "Active goals", "Family completion"].map((title) => (
          <Card key={title}>
            <CardContent className="p-5">
              <p className="text-sm font-medium text-neutral-500">{title}</p>
              <p className="mt-3 text-2xl font-semibold text-neutral-950 dark:text-neutral-50">--</p>
              <p className="mt-2 text-sm text-neutral-500">Coming in a later step</p>
            </CardContent>
          </Card>
        ))}
      </section>
    </div>
  );
}
