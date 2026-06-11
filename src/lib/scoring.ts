import type { Prediction, Result, ScoreCalculation } from "@/types";

export const CORRECT_RESULT = 10;
export const CORRECT_SCORE = 20;
export const CORRECT_CLEAN_SHEET = 5;
export const PERFECT_BONUS = 10;
export const MAX_POINTS = 45;

export function calculateMatchResult(homeScore: number, awayScore: number): "HOME" | "AWAY" | "DRAW" {
  if (homeScore > awayScore) return "HOME";
  if (awayScore > homeScore) return "AWAY";
  return "DRAW";
}

export function calculateCleanSheet(homeScore: number, awayScore: number): boolean {
  return homeScore === 0 || awayScore === 0;
}

export function calculatePoints(
  prediction: Prediction,
  result: Result
): ScoreCalculation {
  let resultPoints = 0;
  let scorePoints = 0;
  let cleanSheetPoints = 0;
  let bonusPoints = 0;

  // Check result accuracy
  if (prediction.resultPrediction === result.winningTeam) {
    resultPoints = CORRECT_RESULT;
  }

  // Check score accuracy
  if (
    prediction.homeScore === result.homeScore &&
    prediction.awayScore === result.awayScore
  ) {
    scorePoints = CORRECT_SCORE;
  }

  // Check clean sheet accuracy
  if (prediction.cleanSheet === result.cleanSheet) {
    cleanSheetPoints = CORRECT_CLEAN_SHEET;
  }

  // Perfect bonus (all three correct)
  if (resultPoints === CORRECT_RESULT && scorePoints === CORRECT_SCORE && cleanSheetPoints === CORRECT_CLEAN_SHEET) {
    bonusPoints = PERFECT_BONUS;
  }

  const total = Math.min(resultPoints + scorePoints + cleanSheetPoints + bonusPoints, MAX_POINTS);

  return {
    resultPoints,
    scorePoints,
    cleanSheetPoints,
    bonusPoints,
    total,
  };
}
