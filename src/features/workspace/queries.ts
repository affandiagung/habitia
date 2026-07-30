import { getActivitiesOverview } from "@/features/activities/queries";
import { toDateInputValue } from "@/features/checklist/date";
import { getChecklistOverview } from "@/features/checklist/queries";
import { getDashboardOverview } from "@/features/dashboard/queries";
import { getOrCreateFamilyOverview } from "@/features/family/queries";
import { getGoalsOverview } from "@/features/goals/queries";
import { getCalendarOverview } from "@/features/calendar/queries";
import { getReportsOverview } from "@/features/reports/queries";

function serializeDate(value: Date | null) {
  return value?.toISOString() ?? null;
}

function serializeRequiredDate(value: Date) {
  return value.toISOString();
}

export async function getWorkspaceOverview() {
  const today = toDateInputValue();
  const familyOverview = await getOrCreateFamilyOverview();
  const [dashboard, goalsOverview, activities, checklist, calendar, reports] = await Promise.all([
    getDashboardOverview(),
    getGoalsOverview(),
    getActivitiesOverview(),
    getChecklistOverview(today),
    getCalendarOverview(today),
    getReportsOverview(),
  ]);

  const family = {
    ...familyOverview.family,
    createdAt: serializeDate(familyOverview.family.createdAt),
    updatedAt: serializeDate(familyOverview.family.updatedAt),
    members: familyOverview.family.members.map((member) => ({
      ...member,
      birthDate: serializeDate(member.birthDate),
      createdAt: serializeDate(member.createdAt),
      updatedAt: serializeDate(member.updatedAt),
    })),
  };

  const goals = goalsOverview.goals.map((goal) => ({
    ...goal,
    startDate: serializeRequiredDate(goal.startDate),
    endDate: serializeDate(goal.endDate),
    createdAt: serializeDate(goal.createdAt),
    updatedAt: serializeDate(goal.updatedAt),
  }));

  const activityGoals = activities.goals.map((goal) => ({
    ...goal,
    startDate: serializeRequiredDate(goal.startDate),
    endDate: serializeDate(goal.endDate),
    createdAt: serializeDate(goal.createdAt),
    updatedAt: serializeDate(goal.updatedAt),
    activities: goal.activities.map((activity) => ({
      ...activity,
      createdAt: serializeDate(activity.createdAt),
      updatedAt: serializeDate(activity.updatedAt),
    })),
  }));

  return {
    dashboard,
    family,
    goals: { goals },
    activities: { ...activities, goals: activityGoals },
    checklist,
    calendar,
    reports,
    settings: {
      profile: {
        email: familyOverview.profile.email,
        displayName: familyOverview.profile.displayName,
      },
      family: {
        name: familyOverview.family.name,
        description: familyOverview.family.description,
        avatarUrl: familyOverview.family.avatarUrl,
        timezone: familyOverview.family.timezone,
      },
    },
  };
}

export type HabitiaWorkspaceData = Awaited<ReturnType<typeof getWorkspaceOverview>>;
