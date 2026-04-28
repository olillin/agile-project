import { NextRequest, NextResponse } from "next/server";

export function GET(req: NextRequest) {
  // Mock redirect directly to callback instead of login page.
  return NextResponse.redirect(new URL("/callback", req.url));
}
