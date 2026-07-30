import { redirect } from "next/navigation";
import { HabitiaWorkspace } from "@/features/workspace/habitia-workspace";
import { getWorkspaceOverview } from "@/features/workspace/queries";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function DashboardPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const initialData = await getWorkspaceOverview();

  return <HabitiaWorkspace initialData={initialData} user={{ email: user.email }} />;
}
