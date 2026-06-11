import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { registerSchema } from "@/lib/validation";
import { hash } from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validation = registerSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Validation failed", details: validation.error.flatten() },
        { status: 400 }
      );
    }

    const { username, email, password, fullName, year, department, mobile } = validation.data;

    // Check unique constraints
    const [existingUsername, existingEmail, existingMobile] = await Promise.all([
      prisma.user.findUnique({ where: { username: username.toLowerCase() } }),
      prisma.user.findUnique({ where: { email: email.toLowerCase() } }),
      mobile ? prisma.user.findUnique({ where: { mobile } }) : Promise.resolve(null),
    ]);

    if (existingUsername) {
      return NextResponse.json({ error: "Username already taken" }, { status: 409 });
    }

    if (existingEmail) {
      return NextResponse.json({ error: "Email already registered" }, { status: 409 });
    }

    if (existingMobile) {
      return NextResponse.json({ error: "Mobile number already registered" }, { status: 409 });
    }

    // Hash password
    const hashedPassword = await hash(password, 12);

    // Create user
    const user = await prisma.user.create({
      data: {
        username: username.toLowerCase(),
        email: email.toLowerCase(),
        password: hashedPassword,
        fullName,
        year,
        department,
        mobile,
      },
      select: {
        id: true,
        username: true,
        email: true,
      },
    });

    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json({ error: "Registration failed" }, { status: 500 });
  }
}
