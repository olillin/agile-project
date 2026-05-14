import { createSession } from "@/lib/session";
import { NextRequest, NextResponse } from "next/server";

// Mocked callback route. Creates a new session without authentication.
export async function GET(req: NextRequest) {
  // Create a new session
  await createSession(1, "Testu", "Exempelsson");

  // Redirect to the admin dashboard
  return NextResponse.redirect(new URL("/admin", req.url));
}
