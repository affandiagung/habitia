export const goalCategories = [
  { value: "HEALTH", label: "Health" },
  { value: "RELIGION", label: "Religion" },
  { value: "LEARNING", label: "Learning" },
  { value: "FINANCE", label: "Finance" },
  { value: "LIFESTYLE", label: "Lifestyle" },
  { value: "CUSTOM", label: "Custom" },
] as const;

export const goalColors = [
  { value: "slate", label: "Slate", className: "bg-slate-500" },
  { value: "emerald", label: "Emerald", className: "bg-emerald-500" },
  { value: "sky", label: "Sky", className: "bg-sky-500" },
  { value: "violet", label: "Violet", className: "bg-violet-500" },
  { value: "rose", label: "Rose", className: "bg-rose-500" },
  { value: "amber", label: "Amber", className: "bg-amber-500" },
] as const;

export const goalTemplates = [
  { title: "Workout Challenge", category: "HEALTH", icon: "Dumbbell", color: "emerald", durationDays: 30 },
  { title: "Drink Water", category: "HEALTH", icon: "Droplet", color: "sky", durationDays: 30 },
  { title: "Read Quran", category: "RELIGION", icon: "BookOpen", color: "emerald", durationDays: 30 },
  { title: "English Practice", category: "LEARNING", icon: "Languages", color: "violet", durationDays: 100 },
  { title: "Saving Challenge", category: "FINANCE", icon: "PiggyBank", color: "amber", durationDays: 90 },
  { title: "Early Sleep", category: "LIFESTYLE", icon: "Moon", color: "slate", durationDays: 30 },
] as const;
