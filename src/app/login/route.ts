import { NextRequest, NextResponse } from "next/server";

// Mocked login route. Redirects directly to the callback instead of a login page.
export function GET(req: NextRequest) {
  return NextResponse.redirect(new URL("/callback", req.url));
}
