import { Resend } from "resend";

export async function sendPasswordResetEmail(
  email: string,
  resetLink: string
) {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    throw new Error("RESEND_API_KEY is not configured");
  }

  const resend = new Resend(apiKey);

  const { error } = await resend.emails.send({
    from: "onboarding@resend.dev",
    to: email,
    subject: "Reset your Trivela password",
    html: `
      <h2>Password Reset Request</h2>
      <p>Click the link below to reset your password:</p>
      <p>
        <a href="${resetLink}">
          Reset Password
        </a>
      </p>
      <p>This link expires in 15 minutes.</p>
      <p>If you did not request a password reset, you can safely ignore this email.</p>
    `,
  });

  if (error) {
    console.error("Resend error:", error);
    throw new Error(error.message);
  }
}