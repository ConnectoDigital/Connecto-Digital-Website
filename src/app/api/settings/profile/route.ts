import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const { data: session } = await auth.getSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const [onboarding, subscription] = await Promise.all([
      prisma.onboarding.findUnique({ where: { userId: session.user.id } }),
      prisma.subscription.findUnique({ where: { userId: session.user.id } }),
    ]);

    return NextResponse.json({
      onboarding,
      subscription: subscription
        ? {
            plan: subscription.plan,
            status: subscription.status,
            currentPeriodEnd: subscription.currentPeriodEnd,
          }
        : null,
    });
  } catch (error) {
    console.error("Settings profile GET error:", error);
    return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const { data: session } = await auth.getSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { companyName, website, industry } = body;

    // Input validation
    if (companyName && (typeof companyName !== "string" || companyName.length > 200)) {
      return NextResponse.json({ error: "Invalid company name" }, { status: 400 });
    }
    if (website && (typeof website !== "string" || website.length > 500)) {
      return NextResponse.json({ error: "Invalid website" }, { status: 400 });
    }
    if (industry && (typeof industry !== "string" || industry.length > 100)) {
      return NextResponse.json({ error: "Invalid industry" }, { status: 400 });
    }

    const onboarding = await prisma.onboarding.upsert({
      where: { userId: session.user.id },
      create: {
        userId: session.user.id,
        companyName,
        website,
        industry,
      },
      update: {
        companyName,
        website,
        industry,
      },
    });

    return NextResponse.json({ onboarding });
  } catch (error) {
    console.error("Settings profile PUT error:", error);
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
  }
}
