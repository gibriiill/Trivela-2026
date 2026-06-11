"use client";

import { useState } from "react";
import { format } from "date-fns";

type PendingMatch = {
  id: string;
  teamA: string;
  teamB: string;
  kickoffTime: string;
  stage: string;
  venue?: string | null;
};

export default function AdminResultsPanel({ matches }: { matches: PendingMatch[] }) {
  const [pendingMatches, setPendingMatches] = useState(matches);
  const [savingIds, setSavingIds] = useState<string[]>([]);
  const [message, setMessage] = useState("");

  const publishResult = async (matchId: string, homeScore: number, awayScore: number) => {
    setMessage("");
    setSavingIds((prev) => [...prev, matchId]);

    try {
      const response = await fetch("/api/admin/results", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ matchId, homeScore, awayScore }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData?.error || "Failed to publish result");
      }

      setMessage("✅ Result published successfully.");
      setPendingMatches((current) => current.filter((match) => match.id !== matchId));
    } catch (error) {
      setMessage(`❌ ${(error as Error).message}`);
      console.error(error);
    } finally {
      setSavingIds((prev) => prev.filter((id) => id !== matchId));
    }
  };

  const recalculateAll = async () => {
    setMessage("");
    try {
      const response = await fetch("/api/admin/results", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData?.error || "Failed to recalculate points");
      }
      setMessage("✅ All completed match points recalculated.");
    } catch (error) {
      setMessage(`❌ ${(error as Error).message}`);
      console.error(error);
    }
  };

  return (
    <div className="space-y-8">
      {message && (
        <div
          className={
            "rounded-xl p-4 text-sm font-heading border " +
            (message.includes("✅")
              ? "border-green-500/30 bg-green-500/10 text-green-400"
              : "border-red-500/30 bg-red-500/10 text-red-400")
          }
        >
          {message}
        </div>
      )}

      <div className="card-dark p-6 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="font-display text-2xl text-gold-gradient">Pending Result Publishing</h2>
            <p className="text-sm text-blue-border">Publish scores for completed matches and update player points.</p>
          </div>
          <button
            onClick={recalculateAll}
            className="btn-outline px-6 py-3 text-sm"
          >
            Recalculate All Points
          </button>
        </div>

        {pendingMatches.length === 0 ? (
          <div className="rounded-xl border border-blue-border/20 bg-blue-mid/50 p-6 text-blue-border">
            No completed matches are waiting for published results.
          </div>
        ) : (
          <div className="grid gap-6">
            {pendingMatches.map((match) => (
              <div key={match.id} className="rounded-3xl border border-blue-border/20 bg-blue-deep p-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                  <div>
                    <p className="font-heading font-bold text-lg">{match.teamA} vs {match.teamB}</p>
                    <p className="text-sm text-blue-border">
                      {format(new Date(match.kickoffTime), "PPP • p")} • {match.stage}
                      {match.venue ? ` • ${match.venue}` : ""}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
                  <div className="space-y-2">
                    <label className="block text-sm font-heading font-bold">{match.teamA} Score</label>
                    <input
                      type="number"
                      min={0}
                      max={20}
                      defaultValue={0}
                      id={`homeScore-${match.id}`}
                      className="input-dark w-full"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-heading font-bold">{match.teamB} Score</label>
                    <input
                      type="number"
                      min={0}
                      max={20}
                      defaultValue={0}
                      id={`awayScore-${match.id}`}
                      className="input-dark w-full"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const homeScore = Number((document.getElementById(`homeScore-${match.id}`) as HTMLInputElement).value);
                      const awayScore = Number((document.getElementById(`awayScore-${match.id}`) as HTMLInputElement).value);
                      publishResult(match.id, homeScore, awayScore);
                    }}
                    disabled={savingIds.includes(match.id)}
                    className="btn-gold w-full py-3"
                  >
                    {savingIds.includes(match.id) ? "Publishing..." : "Publish Result"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
