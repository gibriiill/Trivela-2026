import { z } from "zod";

export const registerSchema = z
  .object({
    username: z.string().min(3).max(20).regex(/^[a-zA-Z0-9_]+$/, "Alphanumeric and underscore only"),
    email: z.string().email(),
    password: z
      .string()
      .min(8, "At least 8 characters")
      .regex(/[A-Z]/, "At least one uppercase letter")
      .regex(/\d/, "At least one number"),
    confirmPassword: z.string(),
    fullName: z.string().min(2).max(60),
    year: z.enum(["2026", "2027", "2028", "2029"]),
    department: z.string(),
    mobile: z.string().regex(/^[6-9]\d{9}$/, "Valid Indian mobile number"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email(),
});

export const resetPasswordSchema = z
  .object({
    email: z.string().email(),
    token: z.string(),
    newPassword: z
      .string()
      .min(8)
      .regex(/[A-Z]/)
      .regex(/\d/),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export const predictionSchema = z.object({
  matchId: z.string(),
  resultPrediction: z.enum(["HOME", "AWAY", "DRAW"]),
  homeScore: z.number().int().min(0).max(20),
  awayScore: z.number().int().min(0).max(20),
  cleanSheet: z.boolean(),
});

export const createMatchSchema = z.object({
  teamA: z.string(),
  teamB: z.string(),
  teamAFlag: z.string().optional(),
  teamBFlag: z.string().optional(),
  group: z.string().optional(),
  stage: z.enum(["GROUP", "ROUND_OF_16", "QUARTER_FINAL", "SEMI_FINAL", "THIRD_PLACE", "FINAL"]),
  venue: z.string().optional(),
  kickoffTime: z.string().datetime(),
  status: z.enum(["UPCOMING", "LIVE", "COMPLETED"]).optional(),
});

export const resultSchema = z.object({
  matchId: z.string(),
  homeScore: z.number().int().min(0).max(20),
  awayScore: z.number().int().min(0).max(20),
});
