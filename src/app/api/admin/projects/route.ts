import { NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth/helpers";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const user = await getAuthenticatedUser();
  if (!user || user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const projects = await prisma.project.findMany({
    orderBy: { updatedAt: "desc" },
    include: {
      _count: { select: { requests: true, files: true } },
    },
  });

  // Enrich with user profile info
  const enriched = await Promise.all(
    projects.map(async (project) => {
      const profile = await prisma.userProfile.findUnique({
        where: { userId: project.userId },
      });

      return {
        id: project.id,
        name: project.name,
        description: project.description,
        status: project.status,
        userId: project.userId,
        userRole: profile?.role ?? "CLIENT",
        createdAt: project.createdAt.toISOString(),
        updatedAt: project.updatedAt.toISOString(),
        _count: project._count,
      };
    })
  );

  return NextResponse.json({ projects: enriched });
}
