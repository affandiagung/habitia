import { prisma } from "@/lib/prisma/client";
import { getOwnedFamilyId } from "@/features/family/queries";

export async function getActivitiesOverview() {
  const familyId = await getOwnedFamilyId();

  const goals = await prisma.goal.findMany({
    where: { familyId },
    orderBy: [{ status: "asc" }, { startDate: "desc" }],
    include: {
      activities: {
        orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
      },
    },
  });

  return {
    familyId,
    goals: goals.map((goal) => ({
      ...goal,
      activities: goal.activities.map((activity) => ({
        ...activity,
        targetValue: activity.targetValue?.toString() ?? null,
      })),
    })),
  };
}
