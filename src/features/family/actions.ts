"use server";

import { revalidatePath } from "next/cache";
import { FamilyMemberRole, Gender } from "@prisma/client";
import { prisma } from "@/lib/prisma/client";
import { getOwnedFamilyId } from "./queries";
import { addFamilyMemberSchema, familyProfileSchema } from "./validation";

type FamilyActionState = {
  error?: string;
  message?: string;
};

function getStringValue(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function getFirstValidationError(error: { flatten: () => { fieldErrors: Record<string, string[]> } }) {
  return Object.values(error.flatten().fieldErrors).flat()[0] ?? "Please check the form values.";
}

export async function updateFamilyAction(
  _state: FamilyActionState,
  formData: FormData,
): Promise<FamilyActionState> {
  const familyId = await getOwnedFamilyId();
  const name = getStringValue(formData, "name");
  const description = getStringValue(formData, "description");
  const avatarUrl = getStringValue(formData, "avatarUrl");
  const timezone = getStringValue(formData, "timezone") || "UTC";
  const parsed = familyProfileSchema.safeParse({ name, description, avatarUrl, timezone });

  if (!parsed.success) {
    return { error: getFirstValidationError(parsed.error) };
  }

  await prisma.family.update({
    where: { id: familyId },
    data: {
      name: parsed.data.name,
      description: parsed.data.description,
      avatarUrl: parsed.data.avatarUrl,
      timezone: parsed.data.timezone,
    },
  });

  revalidatePath("/family");
  return { message: "Family profile updated." };
}

export async function addFamilyMemberAction(
  _state: FamilyActionState,
  formData: FormData,
): Promise<FamilyActionState> {
  const familyId = await getOwnedFamilyId();
  const name = getStringValue(formData, "name");
  const nickname = getStringValue(formData, "nickname");
  const avatarUrl = getStringValue(formData, "avatarUrl");
  const role = getStringValue(formData, "role") || "OTHER";
  const gender = getStringValue(formData, "gender");
  const birthDate = getStringValue(formData, "birthDate");
  const colorTheme = getStringValue(formData, "colorTheme") || "slate";
  const parsed = addFamilyMemberSchema.safeParse({
    name,
    nickname,
    avatarUrl,
    role,
    gender,
    birthDate,
    colorTheme,
  });

  if (!parsed.success) {
    return { error: getFirstValidationError(parsed.error) };
  }

  await prisma.familyMember.create({
    data: {
      familyId,
      name: parsed.data.name,
      nickname: parsed.data.nickname,
      avatarUrl: parsed.data.avatarUrl,
      role: parsed.data.role as FamilyMemberRole,
      gender: parsed.data.gender as Gender | null,
      birthDate: parsed.data.birthDate,
      colorTheme: parsed.data.colorTheme,
    },
  });

  revalidatePath("/family");
  return { message: "Family member added." };
}
