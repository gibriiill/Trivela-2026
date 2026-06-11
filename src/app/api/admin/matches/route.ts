import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { createMatchSchema } from "@/lib/validation";

async function checkAdmin(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "ADMIN") {
    return null;
  }
  return session;
}

export async function GET(req: NextRequest) {
  const session = await checkAdmin(req);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const matches = await prisma.match.findMany({
      include: { result: true, _count: { select: { predictions: true } } },
      orderBy: { kickoffTime: "desc" },
    });
    return NextResponse.json(matches);
  } catch (error) {
    console.error("Fetch matches error:", error);
    return NextResponse.json({ error: "Failed to fetch matches" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await checkAdmin(req);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const validation = createMatchSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({ error: "Validation failed" }, { status: 400 });
    }

    const match = await prisma.match.create({
      data: {
        ...validation.data,
        kickoffTime: new Date(validation.data.kickoffTime),
      },
      include: { result: true },
    });

    return NextResponse.json(match, { status: 201 });
  } catch (error) {
    console.error("Create match error:", error);
    return NextResponse.json({ error: "Failed to create match" }, { status: 500 });
  }
}
