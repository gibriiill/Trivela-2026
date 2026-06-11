import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        username: true,
        email: true,
        fullName: true,
        year: true,
        department: true,
        mobile: true,
        college: true,
        totalPoints: true,
        _count: { select: { predictions: true } },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get rank
    const rank =
      (await prisma.user.count({
        where: { role: "USER", totalPoints: { gt: user.totalPoints } },
      })) + 1;

    return NextResponse.json({
      ...user,
      rank,
      predictions: user._count.predictions,
    });
  } catch (error) {
    console.error("Fetch user error:", error);
    return NextResponse.json({ error: "Failed to fetch user" }, { status: 500 });
  }
}
