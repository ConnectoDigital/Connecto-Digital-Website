import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth/helpers";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const user = await getAuthenticatedUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const requestId = request.nextUrl.searchParams.get("requestId");
  if (!requestId) {
    return NextResponse.json({ error: "requestId is required" }, { status: 400 });
  }

  // Verify the user owns the request or is admin
  const targetRequest = await prisma.request.findUnique({
    where: { id: requestId },
    select: { userId: true },
  });

  if (!targetRequest) {
    return NextResponse.json({ error: "Request not found" }, { status: 404 });
  }

  if (targetRequest.userId !== user.id && user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const messages = await prisma.message.findMany({
    where: { requestId },
    orderBy: { createdAt: "asc" },
  });

  return NextResponse.json({ messages });
}

export async function POST(request: Request) {
  const user = await getAuthenticatedUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const { requestId, content } = body;

  if (!requestId || !content || typeof content !== "string" || !content.trim()) {
    return NextResponse.json({ error: "requestId and content are required" }, { status: 400 });
  }

  if (content.length > 5000) {
    return NextResponse.json({ error: "Message too long (max 5000 characters)" }, { status: 400 });
  }

  // Verify the user owns the request or is admin
  const targetRequest = await prisma.request.findUnique({
    where: { id: requestId },
    select: { userId: true },
  });

  if (!targetRequest) {
    return NextResponse.json({ error: "Request not found" }, { status: 404 });
  }

  if (targetRequest.userId !== user.id && user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const message = await prisma.message.create({
    data: {
      content: content.trim(),
      requestId,
      userId: user.id,
      isAdmin: user.role === "ADMIN",
    },
  });

  return NextResponse.json({ message }, { status: 201 });
}
