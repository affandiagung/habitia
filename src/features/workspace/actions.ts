"use server";

import { getChecklistOverview } from "@/features/checklist/queries";
import { getCalendarOverview } from "@/features/calendar/queries";

export async function getChecklistSnapshotAction(entryDate: string) {
  return getChecklistOverview(entryDate);
}

export async function getCalendarSnapshotAction(entryDate: string) {
  return getCalendarOverview(entryDate);
}
