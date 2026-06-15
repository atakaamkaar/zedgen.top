import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const email = req.nextUrl.searchParams.get("email");
  if (!email) {
    return NextResponse.json({ exists: false });
  }
  const user = await prisma.user.findUnique({ where: { email } });
  return NextResponse.json({ exists: !!user });
}
