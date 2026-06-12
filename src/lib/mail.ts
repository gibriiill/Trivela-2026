import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: process.env.SMTP_SECURE === "true",
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
    from: process.env.FROM_EMAIL,
    to: email,
    subject: "Reset your Trivela password",
    html: `
      <h2>Password Reset Request</h2>
      <p>
        <a href="${resetLink}">
          Click here to reset your password
        </a>
      </p>
      <p>This link expires in 15 minutes.</p>
    `,
  });
}