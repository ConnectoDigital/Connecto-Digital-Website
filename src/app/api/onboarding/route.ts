import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const { data: session } = await auth.getSession();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const onboarding = await prisma.onboarding.findUnique({
      where: { userId: session.user.id },
    });

    return NextResponse.json(onboarding);
  } catch (error) {
    console.error("Onboarding GET error:", error);
    return NextResponse.json(
      { error: "Failed to fetch onboarding data" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { data: session } = await auth.getSession();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      step,
      completed,
      companyName,
      website,
      industry,
      brandColors,
      logoUrl,
      projectGoals,
      techStack,
      timeline,
      communication,
    } = body;

    const onboarding = await prisma.onboarding.upsert({
      where: { userId: session.user.id },
      create: {
        userId: session.user.id,
        step: step || 1,
        completed: completed || false,
        companyName,
        website,
        industry,
        brandColors,
        logoUrl,
        projectGoals,
        techStack,
        timeline,
        communication,
      },
      update: {
        step: step || undefined,
        completed: completed || undefined,
        companyName,
        website,
        industry,
        brandColors,
        logoUrl,
        projectGoals,
        techStack,
        timeline,
        communication,
      },
    });

    // When onboarding is completed, create a default project
    if (completed) {
      const existingProject = await prisma.project.findFirst({
        where: { userId: session.user.id },
      });

      if (!existingProject) {
        await prisma.project.create({
          data: {
            name: companyName ? `${companyName} - Main Project` : "Main Project",
            description: projectGoals || "Default project created during onboarding",
            userId: session.user.id,
            status: "ACTIVE",
          },
        });
      }
    }

    return NextResponse.json(onboarding);
  } catch (error) {
    console.error("Onboarding POST error:", error);
    return NextResponse.json(
      { error: "Failed to save onboarding data" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  return POST(request);
}
