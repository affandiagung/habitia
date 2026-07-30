"use server";

import { getChecklistOverview } from "@/features/checklist/queries";
import { getCalendarOverview } from "@/features/calendar/queries";
import { getActivitiesOverview } from "@/features/activities/queries";
import { getGoalsOverview } from "@/features/goals/queries";
import { getReportsOverview } from "@/features/reports/queries";
import { serializeDate, serializeRequiredDate } from "./queries";

export async function getChecklistSnapshotAction(entryDate: string) {
  return getChecklistOverview(entryDate);
}

export async function getCalendarSnapshotAction(entryDate: string) {
  return getCalendarOverview(entryDate);
}

export async function getGoalsSnapshotAction() {
  const overview = await getGoalsOverview();

  return {
    ...overview,
    goals: overview.goals.map((goal) => ({
      ...goal,
      startDate: serializeRequiredDate(goal.startDate),
      endDate: serializeDate(goal.endDate),
      createdAt: serializeDate(goal.createdAt),
      updatedAt: serializeDate(goal.updatedAt),
    })),
  };
}

export async function getActivitiesSnapshotAction() {
  const overview = await getActivitiesOverview();

  return {
    ...overview,
    goals: overview.goals.map((goal) => ({
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
    })),
  };
}

export async function getReportsSnapshotAction() {
  return getReportsOverview();
}
