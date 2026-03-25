import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth/helpers";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const user = await getAuthenticatedUser();
  if (!user || user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const profiles = await prisma.userProfile.findMany({
    orderBy: { createdAt: "desc" },
  });

  const enriched = await Promise.all(
    profiles.map(async (profile) => {
      const [subscription, projectCount] = await Promise.all([
        prisma.subscription.findUnique({ where: { userId: profile.userId } }),
        prisma.project.count({ where: { userId: profile.userId } }),
      ]);

      return {
        id: profile.id,
        userId: profile.userId,
        role: profile.role,
        createdAt: profile.createdAt.toISOString(),
        updatedAt: profile.updatedAt.toISOString(),
        subscription: subscription
          ? { plan: subscription.plan, status: subscription.status }
          : null,
        _count: { projects: projectCount },
      };
    })
  );

  return NextResponse.json({ users: enriched });
}

export async function PATCH(req: NextRequest) {
  const user = await getAuthenticatedUser();
  if (!user || user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json();
  const { userId, role } = body;

  if (!userId || typeof userId !== "string") {
    return NextResponse.json({ error: "userId is required" }, { status: 400 });
  }

  if (!role || !["CLIENT", "ADMIN"].includes(role)) {
    return NextResponse.json({ error: "role must be CLIENT or ADMIN" }, { status: 400 });
  }

  const profile = await prisma.userProfile.findUnique({
    where: { userId },
  });

  if (!profile) {
    return NextResponse.json({ error: "User profile not found" }, { status: 404 });
  }

  const updated = await prisma.userProfile.update({
    where: { userId },
    data: { role },
  });

  return NextResponse.json({
    user: {
      id: updated.id,
      userId: updated.userId,
      role: updated.role,
      createdAt: updated.createdAt.toISOString(),
      updatedAt: updated.updatedAt.toISOString(),
    },
  });
}
