import { createSession } from "@/lib/session";
import { NextRequest, NextResponse } from "next/server";

// Mocked callback route. Creates a new session without authentication.
export async function GET(req: NextRequest) {
  // Create a new session
  await createSession(
    "1e6b625e-a4fe-43c7-8e66-399f328fd4ef",
    "Testu",
    "Exempelsson"
  );

  // Redirect to the admin dashboard
  return NextResponse.redirect(new URL("/admin", req.url));
}
