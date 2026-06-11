import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const status = searchParams.get("status");
    const limit = parseInt(searchParams.get("limit") || "100");

    const where = status ? { status: status as any } : {};

    const matches = await prisma.match.findMany({
      where,
      include: { result: true },
      orderBy: { kickoffTime: "asc" },
      take: limit,
    });

    return NextResponse.json(matches);
  } catch (error) {
    console.error("Fetch matches error:", error);
    return NextResponse.json({ error: "Failed to fetch matches" }, { status: 500 });
  }
}
