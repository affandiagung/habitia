import { z } from "zod";

function isValidUrl(value: string) {
  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
}

const optionalUrl = z
  .string()
  .trim()
  .refine((value) => value === "" || isValidUrl(value), "Enter a valid URL.")
  .transform((value) => (value === "" ? null : value));

export const familyProfileSchema = z.object({
  name: z.string().trim().min(2, "Family name must be at least 2 characters."),
  description: z
    .string()
    .trim()
    .transform((value) => (value === "" ? null : value)),
  avatarUrl: optionalUrl,
  timezone: z.string().trim().min(1, "Timezone is required."),
});

export const addFamilyMemberSchema = z.object({
  name: z.string().trim().min(2, "Member name must be at least 2 characters."),
  nickname: z
    .string()
    .trim()
    .transform((value) => (value === "" ? null : value)),
  avatarUrl: optionalUrl,
  role: z.enum(["FATHER", "MOTHER", "SON", "DAUGHTER", "GRANDPARENT", "OTHER"]),
  gender: z
    .enum(["MALE", "FEMALE", "OTHER", "PREFER_NOT_TO_SAY", ""])
    .transform((value) => (value === "" ? null : value)),
  birthDate: z
    .string()
    .trim()
    .refine((value) => value === "" || !Number.isNaN(Date.parse(`${value}T00:00:00.000Z`)), {
      message: "Enter a valid birth date.",
    })
    .transform((value) => (value === "" ? null : new Date(`${value}T00:00:00.000Z`))),
  colorTheme: z.enum(["slate", "emerald", "sky", "violet", "rose", "amber"]),
});
