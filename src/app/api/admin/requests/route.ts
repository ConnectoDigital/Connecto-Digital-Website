import { NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth/helpers";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const user = await getAuthenticatedUser();
  if (!user || user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const requests = await prisma.request.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      project: { select: { id: true, name: true } },
      messages: { orderBy: { createdAt: "desc" }, take: 1 },
    },
  });

  return NextResponse.json({ requests });
}

export async function PATCH(request: Request) {
  const user = await getAuthenticatedUser();
  if (!user || user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await request.json();
  const { requestId, status } = body;

  const validStatuses = ["PENDING", "IN_PROGRESS", "IN_REVIEW", "COMPLETED", "CANCELLED"];

  if (!requestId || !status) {
    return NextResponse.json({ error: "requestId and status required" }, { status: 400 });
  }

  if (!validStatuses.includes(status)) {
    return NextResponse.json({ error: `Invalid status. Must be one of: ${validStatuses.join(", ")}` }, { status: 400 });
  }

  const updated = await prisma.request.update({
    where: { id: requestId },
    data: { status },
    include: {
      project: { select: { id: true, name: true } },
    },
  });

  return NextResponse.json({ request: updated });
}
