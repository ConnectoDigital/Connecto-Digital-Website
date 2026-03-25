import { NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth/helpers";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const user = await getAuthenticatedUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const requests = await prisma.request.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    include: {
      project: { select: { id: true, name: true } },
      messages: { orderBy: { createdAt: "desc" }, take: 1 },
    },
  });

  return NextResponse.json({ requests });
}

export async function POST(request: Request) {
  const user = await getAuthenticatedUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const { title, description, priority, projectId } = body;

  if (!title || typeof title !== "string" || title.trim().length > 200) {
    return NextResponse.json({ error: "Title required (max 200 chars)" }, { status: 400 });
  }
  if (!description || typeof description !== "string" || description.trim().length > 5000) {
    return NextResponse.json({ error: "Description required (max 5000 chars)" }, { status: 400 });
  }
  if (!projectId) return NextResponse.json({ error: "Project ID required" }, { status: 400 });

  const validPriorities = ["LOW", "NORMAL", "HIGH", "URGENT"];
  if (priority && !validPriorities.includes(priority)) {
    return NextResponse.json({ error: `Invalid priority. Must be one of: ${validPriorities.join(", ")}` }, { status: 400 });
  }

  const project = await prisma.project.findFirst({
    where: { id: projectId, userId: user.id },
  });

  if (!project) {
    return NextResponse.json({ error: "Project not found" }, { status: 404 });
  }

  const newRequest = await prisma.request.create({
    data: {
      title: title.trim(),
      description: description.trim(),
      priority: priority || "NORMAL",
      projectId,
      userId: user.id,
    },
    include: {
      project: { select: { id: true, name: true } },
    },
  });

  return NextResponse.json({ request: newRequest }, { status: 201 });
}
