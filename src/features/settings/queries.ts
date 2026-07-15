import { getOrCreateFamilyOverview } from "@/features/family/queries";

export async function getSettingsOverview() {
  const { profile, family } = await getOrCreateFamilyOverview();
  return {
    profile: {
      email: profile.email,
      displayName: profile.displayName,
    },
    family: {
      name: family.name,
      description: family.description,
      avatarUrl: family.avatarUrl,
      timezone: family.timezone,
    },
  };
}
