import { auth } from "./server";
import { prisma } from "@/lib/prisma";

export async function getAuthenticatedUser() {
  const { data: session } = await auth.getSession();
  if (!session?.user) return null;

  let profile = await prisma.userProfile.findUnique({
    where: { userId: session.user.id },
  });

  if (!profile) {
    profile = await prisma.userProfile.create({
      data: { userId: session.user.id, role: "CLIENT" },
    });
  }

  return {
    ...session.user,
    role: profile.role as "CLIENT" | "ADMIN",
  };
}
