import { getDashboardOverview } from "@/features/dashboard/queries";
import { getOrCreateFamilyOverview } from "@/features/family/queries";

function serializeDate(value: Date | null) {
  return value?.toISOString() ?? null;
}

function serializeRequiredDate(value: Date) {
  return value.toISOString();
}

export async function getWorkspaceOverview() {
  const familyOverview = await getOrCreateFamilyOverview();
  const dashboard = await getDashboardOverview();

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

  return {
    dashboard,
    family,
    goals: null,
    activities: null,
    checklist: null,
    calendar: null,
    reports: null,
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

export { serializeDate, serializeRequiredDate };
