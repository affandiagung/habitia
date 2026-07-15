export const familyMemberRoles = [
  { value: "FATHER", label: "Father" },
  { value: "MOTHER", label: "Mother" },
  { value: "SON", label: "Son" },
  { value: "DAUGHTER", label: "Daughter" },
  { value: "GRANDPARENT", label: "Grandparent" },
  { value: "OTHER", label: "Other" },
] as const;

export const genderOptions = [
  { value: "", label: "Prefer not to say" },
  { value: "MALE", label: "Male" },
  { value: "FEMALE", label: "Female" },
  { value: "OTHER", label: "Other" },
  { value: "PREFER_NOT_TO_SAY", label: "Prefer not to say" },
] as const;

export const memberColorOptions = [
  { value: "slate", label: "Slate", className: "bg-slate-500" },
  { value: "emerald", label: "Emerald", className: "bg-emerald-500" },
  { value: "sky", label: "Sky", className: "bg-sky-500" },
  { value: "violet", label: "Violet", className: "bg-violet-500" },
  { value: "rose", label: "Rose", className: "bg-rose-500" },
  { value: "amber", label: "Amber", className: "bg-amber-500" },
] as const;

export const timezoneOptions = [
  "Asia/Jakarta",
  "Asia/Makassar",
  "Asia/Jayapura",
  "UTC",
  "America/New_York",
  "America/Los_Angeles",
  "Europe/London",
] as const;
