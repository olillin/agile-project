import { deleteSession } from "@/lib/session";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  await deleteSession();
  return NextResponse.redirect(new URL("/", req.url));
}
