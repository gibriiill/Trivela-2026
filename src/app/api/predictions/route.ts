import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { predictionSchema } from "@/lib/validation";
import { isMatchLocked } from "@/lib/utils";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const searchParams = req.nextUrl.searchParams;
    const matchId = searchParams.get("matchId");

    const where = { userId: session.user.id, ...(matchId && { matchId }) };

    const predictions = await prisma.prediction.findMany({
      where,
      include: { match: { include: { result: true } } },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(predictions);
  } catch (error) {
    console.error("Fetch predictions error:", error);
    return NextResponse.json({ error: "Failed to fetch predictions" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const validation = predictionSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Validation failed", details: validation.error.flatten() },
        { status: 400 }
      );
    }

    const { matchId, resultPrediction, homeScore, awayScore, cleanSheet } = validation.data;

    // Check match exists
    const match = await prisma.match.findUnique({ where: { id: matchId } });

    if (!match) {
      return NextResponse.json({ error: "Match not found" }, { status: 404 });
    }

    // Check if match is locked
    if (isMatchLocked(match.kickoffTime)) {
      return NextResponse.json({ error: "Match is locked for predictions" }, { status: 400 });
    }

    // Upsert prediction
    const prediction = await prisma.prediction.upsert({
      where: { userId_matchId: { userId: session.user.id, matchId } },
      create: {
        userId: session.user.id,
        matchId,
        resultPrediction,
        homeScore,
        awayScore,
        cleanSheet,
      },
      update: {
        resultPrediction,
        homeScore,
        awayScore,
        cleanSheet,
        isCalculated: false,
        pointsEarned: 0,
      },
      include: { match: { include: { result: true } } },
    });

    return NextResponse.json(prediction, { status: 201 });
  } catch (error) {
    console.error("Create prediction error:", error);
    return NextResponse.json({ error: "Failed to create prediction" }, { status: 500 });
  }
}
