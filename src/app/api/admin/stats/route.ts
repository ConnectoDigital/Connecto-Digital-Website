import { NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth/helpers";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const user = await getAuthenticatedUser();
  if (!user || user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const [totalClients, activeSubscriptions, openRequests, subscriptions, recentRequests] =
    await Promise.all([
      prisma.userProfile.count({ where: { role: "CLIENT" } }),
      prisma.subscription.count({ where: { status: "ACTIVE" } }),
      prisma.request.count({ where: { status: { in: ["PENDING", "IN_PROGRESS"] } } }),
      prisma.subscription.findMany({ where: { status: "ACTIVE" } }),
      prisma.request.findMany({
        orderBy: { updatedAt: "desc" },
        take: 10,
        include: { project: { select: { name: true } } },
      }),
    ]);

  // Calculate MRR from active subscriptions
  const planPrices: Record<string, number> = { STARTER: 25, GROWTH: 50, EMBEDDED: 90 };
  const mrr = subscriptions.reduce((sum, sub) => sum + (planPrices[sub.plan] || 0), 0);

  return NextResponse.json({
    totalClients,
    activeSubscriptions,
    openRequests,
    mrr,
    recentActivity: recentRequests.map((r) => ({
      id: r.id,
      title: r.title,
      status: r.status,
      projectName: r.project.name,
      updatedAt: r.updatedAt,
    })),
  });
}
