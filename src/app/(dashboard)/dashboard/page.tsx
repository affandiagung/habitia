import { signOutAction } from "@/features/auth/actions";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function DashboardPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <main className="min-h-screen bg-neutral-50 px-6 py-10 text-neutral-950 dark:bg-neutral-950 dark:text-neutral-50">
      <section className="mx-auto flex max-w-4xl items-center justify-between gap-4 rounded-xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-neutral-500">Habitia</p>
          <h1 className="mt-2 text-2xl font-semibold">Dashboard</h1>
          <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
            Signed in as {user?.email ?? "your family account"}.
          </p>
        </div>
        <form action={signOutAction}>
          <button className="rounded-lg border border-neutral-300 px-4 py-2 text-sm font-medium transition hover:bg-neutral-100 dark:border-neutral-700 dark:hover:bg-neutral-800" type="submit">
            Sign out
          </button>
        </form>
      </section>
    </main>
  );
}
