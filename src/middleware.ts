import { auth } from "@/lib/auth/server";

export default auth.middleware({ loginUrl: "/auth/signin" });

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/admin/:path*",
    "/onboarding/:path*",
    "/get-started/:path*",
  ],
};
