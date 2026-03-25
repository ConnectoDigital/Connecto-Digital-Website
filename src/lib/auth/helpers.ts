import { auth } from "./server";
import { prisma } from "@/lib/prisma";

const ADMIN_EMAILS = [
  "info@connecto.digital",
  "mitchell@connecto.digital",
];

export async function getAuthenticatedUser() {
  const { data: session } = await auth.getSession();
  if (!session?.user) return null;

  const email = session.user.email?.toLowerCase();
  const isAdminEmail = email && ADMIN_EMAILS.includes(email);

  let profile = await prisma.userProfile.findUnique({
    where: { userId: session.user.id },
  });

  if (!profile) {
    profile = await prisma.userProfile.create({
      data: {
        userId: session.user.id,
        role: isAdminEmail ? "ADMIN" : "CLIENT",
      },
    });
  } else if (isAdminEmail && profile.role !== "ADMIN") {
    profile = await prisma.userProfile.update({
      where: { userId: session.user.id },
      data: { role: "ADMIN" },
    });
  }

  return {
    ...session.user,
    role: profile.role as "CLIENT" | "ADMIN",
  };
}
