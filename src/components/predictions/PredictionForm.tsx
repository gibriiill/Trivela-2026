"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Match, Prediction } from "@/types";
import { formatKickoff, getFlag, getResultLabel } from "@/lib/utils";

type PredictionFormProps = {
  match: Match & { kickoffTime: string | Date };
  existingPrediction?: Prediction | null;
};

const getPredictionResult = (homeScore: number, awayScore: number) => {
  if (homeScore > awayScore) return "HOME";
  if (homeScore < awayScore) return "AWAY";
  return "DRAW";
};

export default function PredictionForm({ match, existingPrediction }: PredictionFormProps) {
  const router = useRouter();
  const [homeScore, setHomeScore] = useState<number>(existingPrediction?.homeScore ?? 0);
  const [awayScore, setAwayScore] = useState<number>(existingPrediction?.awayScore ?? 0);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const predictedResult = getPredictionResult(homeScore, awayScore);
  const cleanSheet = homeScore === 0 || awayScore === 0;
  const isLocked = new Date(match.kickoffTime) <= new Date();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/predictions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          matchId: match.id,
          resultPrediction: predictedResult,
          homeScore,
          awayScore,
          cleanSheet,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data?.error || "Unable to save prediction. Please try again.");
        return;
      }

      router.push("/predictions");
    } catch (err) {
      setError("Unable to save prediction. Please try again.");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-[auto_1fr] gap-4 items-center">
        <div className="text-center">
          <div className="text-6xl mb-2">{getFlag(match.teamA)}</div>
          <p className="font-heading font-bold text-sm">{match.teamA}</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-blue-border">Kickoff</p>
          <p className="font-heading font-bold">{formatKickoff(new Date(match.kickoffTime))}</p>
          <p className="mt-2 text-sm text-blue-border">
            {match.stage} • {match.venue ?? "TBA"}
          </p>
        </div>
        <div className="text-center">
          <div className="text-6xl mb-2">{getFlag(match.teamB)}</div>
          <p className="font-heading font-bold text-sm">{match.teamB}</p>
        </div>
      </div>

      {isLocked && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-400">
          Predictions are closed for this match because kickoff has already passed.
        </div>
      )}

      {error && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-400">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="block text-sm font-heading font-bold">{match.teamA} Score</label>
            <input
              type="number"
              min={0}
              max={20}
              value={homeScore}
              onChange={(event) => setHomeScore(Number(event.target.value))}
              className="input-dark w-full"
              disabled={isLocked}
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-heading font-bold">{match.teamB} Score</label>
            <input
              type="number"
              min={0}
              max={20}
              value={awayScore}
              onChange={(event) => setAwayScore(Number(event.target.value))}
              className="input-dark w-full"
              disabled={isLocked}
            />
          </div>
        </div>

        <div className="rounded-xl border border-blue-border/20 bg-blue-mid/50 p-4 space-y-2">
          <p className="text-xs text-blue-border uppercase tracking-[0.15em]">Prediction preview</p>
          <p className="font-heading font-bold text-lg">{match.teamA} {homeScore} – {awayScore} {match.teamB}</p>
          <p className="text-sm text-blue-border">Result: {getResultLabel(predictedResult, match.teamA, match.teamB)}</p>
          <p className="text-sm text-blue-border">
            {cleanSheet ? "Clean sheet predicted" : "No clean sheet predicted"}
          </p>
        </div>

        <button
          type="submit"
          className="btn-gold w-full py-3 disabled:opacity-50"
          disabled={isLocked || isSubmitting}
        >
          {isSubmitting
            ? "Saving prediction..."
            : existingPrediction
            ? "Update Prediction"
            : "Save Prediction"}
        </button>
      </form>
    </div>
  );
}
