import { redirect } from "next/navigation";
import { getAuthenticatedUser } from "@/lib/auth/helpers";
import AdminShell from "./AdminShell";

export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getAuthenticatedUser();

  if (!user) {
    redirect("/auth/signin");
  }

  if (user.role !== "ADMIN") {
    redirect("/dashboard");
  }

  return <AdminShell>{children}</AdminShell>;
}
