import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui";
import { AddFamilyMemberForm } from "@/features/family/add-family-member-form";
import { FamilyProfileForm } from "@/features/family/family-profile-form";
import { MemberList } from "@/features/family/member-list";
import { getOrCreateFamilyOverview } from "@/features/family/queries";

export default async function FamilyPage() {
  const { family } = await getOrCreateFamilyOverview();

  return (
    <div className="space-y-6">
      <section>
        <p className="text-sm font-medium uppercase tracking-[0.18em] text-neutral-500">Family</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-normal text-neutral-950 dark:text-neutral-50">
          Family workspace
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-neutral-600 dark:text-neutral-400">
          Manage the household profile and the members who will participate in goals, activities, and daily checklists.
        </p>
      </section>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_420px]">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Family profile</CardTitle>
              <CardDescription>Timezone controls how daily checklist dates are interpreted.</CardDescription>
            </CardHeader>
            <CardContent>
              <FamilyProfileForm family={family} />
            </CardContent>
          </Card>

          <section className="space-y-3">
            <div>
              <h2 className="text-lg font-semibold tracking-normal text-neutral-950 dark:text-neutral-50">
                Members
              </h2>
              <p className="mt-1 text-sm text-neutral-500">{family.members.length} member(s) in this family.</p>
            </div>
            <MemberList members={family.members} />
          </section>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Add member</CardTitle>
            <CardDescription>Members are managed inside the app and do not have login accounts.</CardDescription>
          </CardHeader>
          <CardContent>
            <AddFamilyMemberForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
