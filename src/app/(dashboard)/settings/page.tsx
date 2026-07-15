import { signOutAction } from "@/features/auth/actions";
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui";
import { FamilyProfileForm } from "@/features/family/family-profile-form";
import { getSettingsOverview } from "@/features/settings/queries";

export default async function SettingsPage() {
  const overview = await getSettingsOverview();

  return (
    <div className="space-y-6">
      <section>
        <p className="text-sm font-medium uppercase tracking-[0.18em] text-neutral-500">Settings</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-normal text-neutral-950 dark:text-neutral-50">
          Workspace settings
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-neutral-600 dark:text-neutral-400">
          Manage account context, family profile, and session controls.
        </p>
      </section>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <Card>
          <CardHeader>
            <CardTitle>Family profile</CardTitle>
            <CardDescription>Shared settings used across checklist, calendar, and reports.</CardDescription>
          </CardHeader>
          <CardContent>
            <FamilyProfileForm family={overview.family} />
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Account</CardTitle>
              <CardDescription>Supabase Auth owns login credentials.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div>
                <p className="text-neutral-500">Email</p>
                <p className="font-medium text-neutral-950 dark:text-neutral-50">{overview.profile.email}</p>
              </div>
              <div>
                <p className="text-neutral-500">Display name</p>
                <p className="font-medium text-neutral-950 dark:text-neutral-50">{overview.profile.displayName ?? "Not set"}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Session</CardTitle>
              <CardDescription>End the current browser session.</CardDescription>
            </CardHeader>
            <CardContent>
              <form action={signOutAction}>
                <Button type="submit" variant="outline">Sign out</Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
