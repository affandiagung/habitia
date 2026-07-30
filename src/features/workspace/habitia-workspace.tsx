"use client";

import { useMemo, useState, useTransition } from "react";
import { signOutAction } from "@/features/auth/actions";
import { ActivityList } from "@/features/activities/activity-list";
import { CreateActivityForm } from "@/features/activities/create-activity-form";
import { CalendarView } from "@/features/calendar/calendar-view";
import { ChecklistDateForm } from "@/features/checklist/checklist-date-form";
import { MemberChecklist } from "@/features/checklist/member-checklist";
import { DashboardWidgets } from "@/features/dashboard/dashboard-widgets";
import { AddFamilyMemberForm } from "@/features/family/add-family-member-form";
import { FamilyProfileForm } from "@/features/family/family-profile-form";
import { MemberList } from "@/features/family/member-list";
import { CreateGoalForm } from "@/features/goals/create-goal-form";
import { GoalList } from "@/features/goals/goal-list";
import { ReportView } from "@/features/reports/report-view";
import { AppShell } from "@/components/layout/app-shell";
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui";
import type { WorkspaceView } from "@/components/layout/app-navigation";
import {
  getActivitiesSnapshotAction,
  getCalendarSnapshotAction,
  getChecklistSnapshotAction,
  getGoalsSnapshotAction,
  getReportsSnapshotAction,
} from "./actions";
import type { HabitiaWorkspaceData } from "./queries";

type HabitiaWorkspaceProps = {
  initialData: HabitiaWorkspaceData;
  user: { email?: string | null };
};

function PageHeader({ eyebrow, title, description }: { eyebrow: string; title: string; description: string }) {
  return (
    <section>
      <p className="text-sm font-medium uppercase tracking-[0.18em] text-neutral-500">{eyebrow}</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-normal text-neutral-950 dark:text-neutral-50">{title}</h1>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-neutral-600 dark:text-neutral-400">{description}</p>
    </section>
  );
}

function ViewLoading({ label }: { label: string }) {
  return (
    <Card>
      <CardContent className="p-6 text-sm text-neutral-500">Loading {label}...</CardContent>
    </Card>
  );
}

export function HabitiaWorkspace({ initialData, user }: HabitiaWorkspaceProps) {
  const [activeView, setActiveView] = useState<WorkspaceView>("dashboard");
  const [goalsOverride, setGoalsOverride] = useState<Awaited<ReturnType<typeof getGoalsSnapshotAction>> | null>(null);
  const [activitiesOverride, setActivitiesOverride] = useState<Awaited<ReturnType<typeof getActivitiesSnapshotAction>> | null>(null);
  const [checklistOverride, setChecklistOverride] = useState<Awaited<ReturnType<typeof getChecklistSnapshotAction>> | null>(null);
  const [calendarOverride, setCalendarOverride] = useState<Awaited<ReturnType<typeof getCalendarSnapshotAction>> | null>(null);
  const [reportsOverride, setReportsOverride] = useState<Awaited<ReturnType<typeof getReportsSnapshotAction>> | null>(null);
  const [selectedChecklistMemberIdOverride, setSelectedChecklistMemberIdOverride] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  const data = {
    ...initialData,
    activities: activitiesOverride ?? initialData.activities,
    calendar: calendarOverride ?? initialData.calendar,
    checklist: checklistOverride ?? initialData.checklist,
    goals: goalsOverride ?? initialData.goals,
    reports: reportsOverride ?? initialData.reports,
  };
  const selectedChecklistMemberId = selectedChecklistMemberIdOverride ?? data.checklist?.family.selectedMemberId ?? null;

  function loadViewData(view: WorkspaceView) {
    if (view === "goals" && !data.goals) {
      startTransition(() => {
        void getGoalsSnapshotAction().then(setGoalsOverride);
      });
    }

    if (view === "activities" && !data.activities) {
      startTransition(() => {
        void getActivitiesSnapshotAction().then(setActivitiesOverride);
      });
    }

    if (view === "checklist" && !data.checklist) {
      startTransition(() => {
        void getChecklistSnapshotAction(new Date().toISOString().slice(0, 10)).then((checklist) => {
          setChecklistOverride(checklist);
          setSelectedChecklistMemberIdOverride(checklist.family.selectedMemberId);
        });
      });
    }

    if (view === "calendar" && !data.calendar) {
      startTransition(() => {
        void getCalendarSnapshotAction(new Date().toISOString().slice(0, 10)).then(setCalendarOverride);
      });
    }

    if (view === "reports" && !data.reports) {
      startTransition(() => {
        void getReportsSnapshotAction().then(setReportsOverride);
      });
    }
  }

  function updateChecklistDate(nextDate: string) {
    startTransition(() => {
      void getChecklistSnapshotAction(nextDate).then((checklist) => {
        setChecklistOverride(checklist);
        setSelectedChecklistMemberIdOverride(checklist.family.selectedMemberId);
      });
    });
  }

  function updateCalendarDate(nextDate: string) {
    startTransition(() => {
      void getCalendarSnapshotAction(nextDate).then((calendar) => {
        setCalendarOverride(calendar);
      });
    });
  }

  function handleViewChange(view: WorkspaceView) {
    setActiveView(view);
    loadViewData(view);
    window.scrollTo({ top: 0, behavior: "auto" });
  }

  const selectedChecklistMembers = useMemo(
    () => data.checklist?.family.members.filter((member) => member.id === selectedChecklistMemberId) ?? [],
    [data.checklist?.family.members, selectedChecklistMemberId],
  );
  const checklistActivityCount = data.checklist?.family.goals.reduce((total, goal) => total + goal.activities.length, 0) ?? 0;
  const goalOptions = data.activities?.goals.map((goal) => ({ id: goal.id, title: goal.title })) ?? [];
  const activityCount = data.activities?.goals.reduce((total, goal) => total + goal.activities.length, 0) ?? 0;

  return (
    <AppShell activeView={activeView} email={user.email ?? undefined} onViewChange={handleViewChange}>
      <div>
        {activeView === "dashboard" ? (
          <div className="space-y-6">
            <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
              <div>
                <p className="text-sm font-medium uppercase tracking-[0.18em] text-neutral-500">Dashboard</p>
                <h1 className="mt-2 text-3xl font-semibold tracking-normal text-neutral-950 dark:text-neutral-50">
                  {data.dashboard.family.name} progress overview
                </h1>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-neutral-600 dark:text-neutral-400">
                  Track today&apos;s completion, current goals, family ranking, and recent checklist activity.
                </p>
              </div>
              <form action={signOutAction}>
                <Button type="submit" variant="outline">Sign out</Button>
              </form>
            </section>
            <DashboardWidgets overview={data.dashboard} />
          </div>
        ) : null}

        {activeView === "family" ? (
          <div className="space-y-6">
            <PageHeader
              description="Manage the household profile and the members who will participate in goals, activities, and daily checklists."
              eyebrow="Family"
              title="Family workspace"
            />
            <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_420px]">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Family profile</CardTitle>
                    <CardDescription>Timezone controls how daily checklist dates are interpreted.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <FamilyProfileForm family={data.family} />
                  </CardContent>
                </Card>
                <section className="space-y-3">
                  <div>
                    <h2 className="text-lg font-semibold tracking-normal text-neutral-950 dark:text-neutral-50">Members</h2>
                    <p className="mt-1 text-sm text-neutral-500">{data.family.members.length} member(s) in this family.</p>
                  </div>
                  <MemberList members={data.family.members} />
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
        ) : null}

        {activeView === "goals" ? (
          <div className="space-y-6">
            <PageHeader
              description="Create goal containers for habits and challenges. Activities can be attached after each goal is ready."
              eyebrow="Goals"
              title="Family goals"
            />
            <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_420px]">
              <section className="space-y-3">
                <div>
                  <h2 className="text-lg font-semibold tracking-normal text-neutral-950 dark:text-neutral-50">Current goals</h2>
                  <p className="mt-1 text-sm text-neutral-500">{data.goals?.goals.length ?? 0} goal(s) created.</p>
                </div>
                {data.goals ? <GoalList goals={data.goals.goals} /> : <ViewLoading label="goals" />}
              </section>
              <Card>
                <CardHeader>
                  <CardTitle>Create goal</CardTitle>
                  <CardDescription>Start custom or use a template preset. Every goal remains editable later.</CardDescription>
                </CardHeader>
                <CardContent>
                  <CreateGoalForm />
                </CardContent>
              </Card>
            </div>
          </div>
        ) : null}

        {activeView === "activities" ? (
          <div className="space-y-6">
            <PageHeader
              description="Define the specific actions that make each family goal measurable. Daily recording starts in the checklist step."
              eyebrow="Activities"
              title="Goal activities"
            />
            <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_420px]">
              <section className="space-y-3">
                <div>
                  <h2 className="text-lg font-semibold tracking-normal text-neutral-950 dark:text-neutral-50">Activity library</h2>
                  <p className="mt-1 text-sm text-neutral-500">{activityCount} activity item(s) across {data.activities?.goals.length ?? 0} goal(s).</p>
                </div>
                {data.activities ? <ActivityList goals={data.activities.goals} /> : <ViewLoading label="activities" />}
              </section>
              <Card>
                <CardHeader>
                  <CardTitle>Create activity</CardTitle>
                  <CardDescription>Attach an activity to a goal and choose how it should be measured.</CardDescription>
                </CardHeader>
                <CardContent>
                  {data.activities ? <CreateActivityForm goals={goalOptions} /> : <ViewLoading label="activity options" />}
                </CardContent>
              </Card>
            </div>
          </div>
        ) : null}

        {activeView === "checklist" ? (
          <div className="space-y-6">
            <section className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="text-sm font-medium uppercase tracking-[0.18em] text-neutral-500">Daily Checklist</p>
                <h1 className="mt-2 text-3xl font-semibold tracking-normal text-neutral-950 dark:text-neutral-50">Record daily progress</h1>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-neutral-600 dark:text-neutral-400">
                  Update progress for each family member across active goals and activities.
                </p>
              </div>
              <Card className="w-full lg:w-80">
                <CardContent className="p-4">
                  <ChecklistDateForm
                    date={data.checklist?.family.date ?? new Date().toISOString().slice(0, 10)}
                    memberId={selectedChecklistMemberId}
                    onDateChange={updateChecklistDate}
                  />
                </CardContent>
              </Card>
            </section>
            <Card>
              <CardHeader>
                <CardTitle>Checklist summary</CardTitle>
                <CardDescription>
                  {data.checklist?.family.members.length ?? 0} member(s), {data.checklist?.family.goals.length ?? 0} active goal(s), {checklistActivityCount} activity item(s).
                </CardDescription>
              </CardHeader>
              {data.checklist?.family.members.length ? (
                <CardContent className="flex flex-wrap gap-2">
                  {data.checklist.family.members.map((member) => (
                    <Button
                      key={member.id}
                      onClick={() => setSelectedChecklistMemberIdOverride(member.id)}
                      size="sm"
                      type="button"
                      variant={member.id === selectedChecklistMemberId ? "primary" : "outline"}
                    >
                      {member.name}
                    </Button>
                  ))}
                </CardContent>
              ) : null}
            </Card>
            {data.checklist ? (
              <MemberChecklist
                entries={data.checklist.family.dailyEntries}
                entryDate={data.checklist.family.date ?? new Date().toISOString().slice(0, 10)}
                goals={data.checklist.family.goals}
                members={selectedChecklistMembers}
              />
            ) : (
              <ViewLoading label="checklist" />
            )}
          </div>
        ) : null}

        {activeView === "calendar" ? (
          <div className="space-y-6">
            <PageHeader
              description="Review completion history by date and inspect member records for each day."
              eyebrow="Calendar"
              title="Historical progress calendar"
            />
            {data.calendar ? <CalendarView overview={data.calendar} onDateSelect={updateCalendarDate} /> : <ViewLoading label="calendar" />}
          </div>
        ) : null}

        {activeView === "reports" ? (
          <div className="space-y-6">
            <PageHeader
              description="Review completion, missed records, member performance, and goal progress from checklist history."
              eyebrow="Reports"
              title="Family analytics"
            />
            {data.reports ? <ReportView overview={data.reports} /> : <ViewLoading label="reports" />}
          </div>
        ) : null}

        {activeView === "settings" ? (
          <div className="space-y-6">
            <PageHeader
              description="Manage account context, family profile, and session controls."
              eyebrow="Settings"
              title="Workspace settings"
            />
            <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
              <Card>
                <CardHeader>
                  <CardTitle>Family profile</CardTitle>
                  <CardDescription>Shared settings used across checklist, calendar, and reports.</CardDescription>
                </CardHeader>
                <CardContent>
                  <FamilyProfileForm family={data.settings.family} />
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
                      <p className="font-medium text-neutral-950 dark:text-neutral-50">{data.settings.profile.email}</p>
                    </div>
                    <div>
                      <p className="text-neutral-500">Display name</p>
                      <p className="font-medium text-neutral-950 dark:text-neutral-50">{data.settings.profile.displayName ?? "Not set"}</p>
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
        ) : null}
      </div>
    </AppShell>
  );
}
