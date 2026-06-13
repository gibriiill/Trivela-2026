import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { resetPasswordSchema } from "@/lib/validation";
import { hash } from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const validation = resetPasswordSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid request" },
        { status: 400 }
      );
    }

    const { token, newPassword } = validation.data;

    const resetToken = await prisma.passwordResetToken.findUnique({
      where: { token },
    });

    if (!resetToken) {
      return NextResponse.json(
        { error: "Invalid reset token" },
        { status: 400 }
      );
    }

    if (resetToken.expires < new Date()) {
      await prisma.passwordResetToken.delete({
        where: { token },
      });

      return NextResponse.json(
        { error: "Reset token has expired" },
        { status: 400 }
      );
    }

    const hashedPassword = await hash(newPassword, 12);

    await prisma.user.update({
      where: {
        email: resetToken.email,
      },
      data: {
        password: hashedPassword,
      },
    });

    await prisma.passwordResetToken.delete({
      where: { token },
    });

    return NextResponse.json({
      message: "Password reset successful",
    });
  } catch (error) {
    console.error("Reset password error:", error);

    return NextResponse.json(
      { error: "Failed to reset password" },
      { status: 500 }
    );
  }
}