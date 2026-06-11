import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const limit = parseInt(searchParams.get("limit") || "100");

    const leaderboard = await prisma.user.findMany({
      where: {
        role: "USER",
        predictions: { some: {} },
      },
      select: {
        id: true,
        username: true,
        fullName: true,
        college: true,
        totalPoints: true,
        _count: { select: { predictions: true } },
      },
      orderBy: [{ totalPoints: "desc" }, { username: "asc" }],
      take: limit,
    });

    // Add rank
    const ranked = leaderboard.map((user, index) => ({
      ...user,
      rank: index + 1,
      predictions: user._count.predictions,
    }));

    const stats = {
      totalParticipants: await prisma.user.count({ where: { role: "USER" } }),
      totalPredictions: await prisma.prediction.count(),
      matchesCompleted: await prisma.match.count({ where: { status: "COMPLETED" } }),
    };

    return NextResponse.json({ entries: ranked, stats });
  } catch (error) {
    console.error("Fetch leaderboard error:", error);
    return NextResponse.json({ error: "Failed to fetch leaderboard" }, { status: 500 });
  }
}
