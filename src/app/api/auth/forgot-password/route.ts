import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { forgotPasswordSchema } from "@/lib/validation";
import { sendPasswordResetEmail } from "@/lib/mail";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const validation = forgotPasswordSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400 }
      );
    }

    const { email } = validation.data;

    const user = await prisma.user.findUnique({
      where: {
        email: email.toLowerCase(),
      },
    });

    // Prevent email enumeration
    if (!user) {
      return NextResponse.json({
        message:
          "If an account exists, a reset link has been sent.",
      });
    }

    const token = crypto.randomBytes(32).toString("hex");

    const expires = new Date(
      Date.now() + 15 * 60 * 1000
    );

    await prisma.passwordResetToken.create({
      data: {
        email: user.email,
        token,
        expires,
      },
    });

    const baseUrl =
      process.env.NEXT_PUBLIC_APP_URL ||
      process.env.NEXTAUTH_URL;

    const resetLink =
      `${baseUrl}/auth/reset-password/${token}`;

    console.log("Sending reset email to:", user.email);

    await sendPasswordResetEmail(
      user.email,
      resetLink
    );

    console.log("Reset email sent");

    return NextResponse.json({
      message:
        "If an account exists, a reset link has been sent.",
    });
  } catch (error) {
    console.error(
      "Forgot password error:",
      error
    );

    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 }
    );
  }
}