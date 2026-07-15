import { prisma } from "@/lib/prisma/client";
import { getOwnedFamilyId } from "@/features/family/queries";

export async function getGoalsOverview() {
  const familyId = await getOwnedFamilyId();

  const goals = await prisma.goal.findMany({
    where: { familyId },
    orderBy: [{ status: "asc" }, { startDate: "desc" }, { createdAt: "desc" }],
    include: { activities: { select: { id: true } } },
  });

  return { familyId, goals };
}
