import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma/client";
import { createSupabaseServerClient } from "@/lib/supabase/server";

async function getCurrentUser() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email) {
    redirect("/login");
  }

  return user;
}

export async function getOrCreateFamilyOverview() {
  const user = await getCurrentUser();
  const displayName =
    typeof user.user_metadata?.display_name === "string" ? user.user_metadata.display_name : null;

  const profile = await prisma.appProfile.upsert({
    where: { authUserId: user.id },
    update: {
      email: user.email!,
      displayName,
    },
    create: {
      authUserId: user.id,
      email: user.email!,
      displayName,
    },
  });

  const family =
    (await prisma.family.findUnique({
      where: { profileId: profile.id },
      include: { members: { orderBy: { createdAt: "asc" } } },
    })) ??
    (await prisma.family.create({
      data: {
        profileId: profile.id,
        name: displayName ? `${displayName}'s Family` : "My Family",
        timezone: "Asia/Jakarta",
      },
      include: { members: { orderBy: { createdAt: "asc" } } },
    }));

  return { profile, family };
}

export async function getOwnedFamilyId() {
  const user = await getCurrentUser();
  const profile = await prisma.appProfile.findUnique({
    where: { authUserId: user.id },
    select: { family: { select: { id: true } } },
  });

  if (!profile?.family?.id) {
    const { family } = await getOrCreateFamilyOverview();
    return family.id;
  }

  return profile.family.id;
}
