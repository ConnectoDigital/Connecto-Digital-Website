import { NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth/helpers";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const user = await getAuthenticatedUser();
  if (!user || user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // Get all client profiles with their related data
  const profiles = await prisma.userProfile.findMany({
    where: { role: "CLIENT" },
    orderBy: { createdAt: "desc" },
  });

  // For each client, get their subscription and project count
  const clients = await Promise.all(
    profiles.map(async (profile) => {
      const [subscription, projectCount] = await Promise.all([
        prisma.subscription.findUnique({ where: { userId: profile.userId } }),
        prisma.project.count({ where: { userId: profile.userId } }),
      ]);

      return {
        id: profile.userId,
        name: null, // Name comes from Neon Auth session, not stored in our DB
        email: null,
        createdAt: profile.createdAt.toISOString(),
        subscription: subscription
          ? { plan: subscription.plan, status: subscription.status }
          : null,
        _count: { projects: projectCount },
      };
    })
  );

  return NextResponse.json({ clients });
}
