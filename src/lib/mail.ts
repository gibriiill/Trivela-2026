import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false, // for port 587
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendPasswordResetEmail(
  email: string,
  resetLink: string
) {
  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
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
}
