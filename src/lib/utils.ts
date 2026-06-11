import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { COUNTRY_FLAGS, STAGE_LABELS } from "@/types";
import { format, isPast, isWithinInterval, addMinutes, formatDistanceToNow } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getFlag(country: string): string {
  return COUNTRY_FLAGS[country] || "🏳️";
}

export function formatKickoff(date: Date): string {
  return format(date, "MMM d, yyyy • HH:mm");
}

export function formatTimeAgo(date: Date): string {
  return formatDistanceToNow(date, { addSuffix: true });
}

export function isMatchLocked(kickoffTime: Date): boolean {
  return isPast(kickoffTime);
}

export function isMatchLive(kickoffTime: Date): boolean {
  return isWithinInterval(new Date(), {
    start: addMinutes(kickoffTime, -105),
    end: addMinutes(kickoffTime, 105),
  });
}

export function getResultLabel(result: "HOME" | "AWAY" | "DRAW", teamA: string, teamB: string): string {
  switch (result) {
    case "HOME":
      return `${teamA} wins`;
    case "AWAY":
      return `${teamB} wins`;
    case "DRAW":
      return "Draw";
    default:
      return "Unknown";
  }
}

export function getStageLabel(stage: string): string {
  return STAGE_LABELS[stage as keyof typeof STAGE_LABELS] || stage;
}

export function formatScore(home: number, away: number): string {
  return `${home} – ${away}`;
}

export function getRankSuffix(rank: number): string {
  if (rank % 100 >= 11 && rank % 100 <= 13) return "th";
  switch (rank % 10) {
    case 1:
      return "st";
    case 2:
      return "nd";
    case 3:
      return "rd";
    default:
      return "th";
  }
}
