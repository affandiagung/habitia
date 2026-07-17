import { Card, CardContent, Skeleton } from "@/components/ui";

export default function DashboardGroupLoading() {
  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-9 w-80 max-w-full" />
        <Skeleton className="h-5 w-[32rem] max-w-full" />
      </div>
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
      <Card>
        <CardContent className="space-y-3 p-5">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
        </CardContent>
      </Card>
    </div>
  );
}
