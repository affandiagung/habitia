import { ReportView } from "@/features/reports/report-view";
import { getReportsOverview } from "@/features/reports/queries";

export default async function ReportsPage() {
  const overview = await getReportsOverview();

  return (
    <div className="space-y-6">
      <section>
        <p className="text-sm font-medium uppercase tracking-[0.18em] text-neutral-500">Reports</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-normal text-neutral-950 dark:text-neutral-50">
          Family analytics
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-neutral-600 dark:text-neutral-400">
          Review completion, missed records, member performance, and goal progress from checklist history.
        </p>
      </section>
      <ReportView overview={overview} />
    </div>
  );
}
