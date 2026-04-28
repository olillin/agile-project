import { verifySession } from "@/lib/session";
import { NextRequest, NextResponse } from "next/server";

const protectedRoutes: RegExp[] = [/\/admin(\/.*)?/];

export default async function proxy(req: NextRequest) {
  // Check if the current route is protected
  const path = req.nextUrl.pathname;
  const isProtectedRoute = !!protectedRoutes.find(pattern =>
    pattern.test(path)
  );

  // Verify session and redirect if not authenticated
  if (isProtectedRoute) {
    try {
      await verifySession();
    } catch (e) {
      // Do not log errors for calling redirect(), this is an expected error.
      const isRedirectError =
        typeof e === "object" &&
        e !== null &&
        String((e as Record<string, unknown>).digest).includes("NEXT_REDIRECT");
      if (!isRedirectError) {
        console.error("Failed to verify session:", e);
      }
      // Mock redirects to homepage instead of login page since /login instantly
      // authenticates the user.
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  return NextResponse.next();
}

// Routes Proxy should not run on
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
