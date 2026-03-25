import { NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth/helpers";
import { prisma } from "@/lib/prisma";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getAuthenticatedUser();
  if (!user || user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;

  const profile = await prisma.userProfile.findUnique({
    where: { userId: id },
  });

  if (!profile) {
    return NextResponse.json({ error: "Client not found" }, { status: 404 });
  }

  const [projects, requests, subscription, onboarding] = await Promise.all([
    prisma.project.findMany({
      where: { userId: id },
      include: { _count: { select: { requests: true } } },
    }),
    prisma.request.findMany({
      where: { userId: id },
      orderBy: { createdAt: "desc" },
      take: 10,
      include: { project: { select: { name: true } } },
    }),
    prisma.subscription.findUnique({ where: { userId: id } }),
    prisma.onboarding.findUnique({ where: { userId: id } }),
  ]);

  return NextResponse.json({
    client: {
      id: profile.userId,
      role: profile.role,
      createdAt: profile.createdAt.toISOString(),
      subscription: subscription
        ? { plan: subscription.plan, status: subscription.status }
        : null,
      _count: { projects: projects.length },
      projects,
      requests,
      onboarding,
    },
  });
}
