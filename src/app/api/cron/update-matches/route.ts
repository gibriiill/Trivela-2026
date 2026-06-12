import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const now = new Date();
  const twoHoursAgo = new Date(now.getTime() - 2 * 60 * 60 * 1000);

  const toLive = await prisma.match.updateMany({
    where: {
      status: "UPCOMING",
      kickoffTime: { lte: now },
    },
    data: { status: "LIVE" },
  });

  const toCompleted = await prisma.match.updateMany({
    where: {
      status: "LIVE",
      kickoffTime: { lte: twoHoursAgo },
    },
    data: { status: "COMPLETED" },
  });

  return NextResponse.json({
    success: true,
    setToLive: toLive.count,
    setToCompleted: toCompleted.count,
    timestamp: now.toISOString(),
  });
}