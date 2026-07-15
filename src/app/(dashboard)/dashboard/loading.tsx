import { Card, CardContent, Skeleton } from "@/components/ui";

export default function DashboardLoading() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-24 w-full" />
      <section className="grid gap-4 md:grid-cols-3">
        {[0, 1, 2].map((item) => (
          <Card key={item}>
            <CardContent className="space-y-3 p-5">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-8 w-20" />
              <Skeleton className="h-4 w-36" />
            </CardContent>
          </Card>
        ))}
      </section>
    </div>
  );
}
