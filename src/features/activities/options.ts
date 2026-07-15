export const activityTypes = [
  { value: "CHECKBOX", label: "Checkbox", unitHint: "Done / not done" },
  { value: "NUMBER", label: "Number", unitHint: "reps, pages, glasses" },
  { value: "DURATION", label: "Duration", unitHint: "minutes" },
  { value: "DISTANCE", label: "Distance", unitHint: "km, miles, steps" },
  { value: "TEXT", label: "Text", unitHint: "reflection, notes" },
  { value: "RATING", label: "Rating", unitHint: "1-5" },
] as const;

export const defaultUnitsByType: Record<(typeof activityTypes)[number]["value"], string> = {
  CHECKBOX: "",
  NUMBER: "reps",
  DURATION: "minutes",
  DISTANCE: "km",
  TEXT: "",
  RATING: "stars",
};
