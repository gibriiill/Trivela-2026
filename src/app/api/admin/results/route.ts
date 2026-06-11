import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { resultSchema } from "@/lib/validation";
import { calculatePoints, calculateMatchResult, calculateCleanSheet } from "@/lib/scoring";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const validation = resultSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({ error: "Validation failed" }, { status: 400 });
    }

    const { matchId, homeScore, awayScore } = validation.data;

    const match = await prisma.match.findUnique({
      where: { id: matchId },
      include: { predictions: true },
    });

    if (!match) {
      return NextResponse.json({ error: "Match not found" }, { status: 404 });
    }

    const winningTeam = calculateMatchResult(homeScore, awayScore);
    const cleanSheet = calculateCleanSheet(homeScore, awayScore);

    // Upsert result
    const result = await prisma.result.upsert({
      where: { matchId },
      create: {
        matchId,
        homeScore,
        awayScore,
        winningTeam,
        cleanSheet,
      },
      update: {
        homeScore,
        awayScore,
        winningTeam,
        cleanSheet,
      },
    });

    // Update match status
    await prisma.match.update({
      where: { id: matchId },
      data: { status: "COMPLETED" },
    });

    // Calculate points for all predictions
    const predictions = await prisma.prediction.findMany({
      where: { matchId, isCalculated: false },
    });

    for (const pred of predictions) {
      const points = calculatePoints(pred, result);
      await prisma.prediction.update({
        where: { id: pred.id },
        data: {
          pointsEarned: points.total,
          isCalculated: true,
        },
      });
    }

    // Update user total points
    const userIds = [...new Set(predictions.map((p) => p.userId))];
    for (const userId of userIds) {
      const total = await prisma.prediction.aggregate({
        where: { userId, isCalculated: true },
        _sum: { pointsEarned: true },
      });
      await prisma.user.update({
        where: { id: userId },
        data: { totalPoints: total._sum.pointsEarned || 0 },
      });
    }

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error("Create result error:", error);
    return NextResponse.json({ error: "Failed to create result" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Recalculate all predictions
    const completedMatches = await prisma.match.findMany({
      where: { status: "COMPLETED", result: { isNot: null } },
      include: { result: true, predictions: true },
    });

    for (const match of completedMatches) {
      if (!match.result) continue;

      for (const pred of match.predictions) {
        const points = calculatePoints(pred, match.result);
        await prisma.prediction.update({
          where: { id: pred.id },
          data: {
            pointsEarned: points.total,
            isCalculated: true,
          },
        });
      }
    }

    // Recalculate all user points
    const users = await prisma.user.findMany({ where: { role: "USER" } });
    for (const user of users) {
      const total = await prisma.prediction.aggregate({
        where: { userId: user.id },
        _sum: { pointsEarned: true },
      });
      await prisma.user.update({
        where: { id: user.id },
        data: { totalPoints: total._sum.pointsEarned || 0 },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Recalculate points error:", error);
    return NextResponse.json({ error: "Failed to recalculate points" }, { status: 500 });
  }
}
