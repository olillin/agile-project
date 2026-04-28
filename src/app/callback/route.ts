import { createSession } from "@/lib/session";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  // Mock ignore 'code' argument

  // Create a new session
  console.log("creating session");
  await createSession("Testu", "Exempelsson");

  return NextResponse.redirect(new URL("/admin", req.url));
}
