import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const [totalParticipants, totalPredictions, matchesCompleted] = await Promise.all([
      prisma.user.count({ where: { role: "USER" } }),
      prisma.prediction.count(),
      prisma.match.count({ where: { status: "COMPLETED" } }),
    ]);

    return NextResponse.json({
      totalParticipants,
      totalPredictions,
      matchesCompleted,
    });
  } catch (error) {
    console.error("Fetch stats error:", error);
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}
