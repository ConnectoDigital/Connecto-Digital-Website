import { NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth/helpers";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const user = await getAuthenticatedUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const [activeProjects, pendingRequests, completedRequests, subscription, recentRequests] =
    await Promise.all([
      prisma.project.count({ where: { userId: user.id, status: "ACTIVE" } }),
      prisma.request.count({
        where: { userId: user.id, status: { in: ["PENDING", "IN_PROGRESS"] } },
      }),
      prisma.request.count({ where: { userId: user.id, status: "COMPLETED" } }),
      prisma.subscription.findUnique({ where: { userId: user.id } }),
      prisma.request.findMany({
        where: { userId: user.id },
        orderBy: { updatedAt: "desc" },
        take: 5,
        include: { project: { select: { name: true } } },
      }),
    ]);

  return NextResponse.json({
    activeProjects,
    pendingRequests,
    completedRequests,
    plan: subscription?.plan ?? null,
    subscriptionStatus: subscription?.status ?? null,
    recentActivity: recentRequests.map((r) => ({
      id: r.id,
      title: r.title,
      status: r.status,
      projectName: r.project.name,
      updatedAt: r.updatedAt,
    })),
  });
}
