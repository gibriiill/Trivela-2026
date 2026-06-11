"use client";

import React from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Match, Prediction } from "@/types";
import { formatKickoff, getFlag, isMatchLocked, isMatchLive, formatScore, getResultLabel, cn } from "@/lib/utils";
import { Zap } from "lucide-react";
import { useState } from "react";

interface MatchCardProps {
  match: Match & { result?: any; _count?: { predictions: number } };
  userPrediction?: Prediction;
  showPredictButton?: boolean;
}

export function MatchCard({
  match,
  userPrediction,
  showPredictButton = true,
}: MatchCardProps) {
  const { data: session } = useSession();
  const isLocked = isMatchLocked(match.kickoffTime);
  const isLive = isMatchLive(match.kickoffTime);
  const [timeLeft, setTimeLeft] = useState("");

  // Calculate time until kickoff for upcoming matches
  React.useEffect(() => {
    if (match.status === "UPCOMING") {
      const updateTime = () => {
        const now = new Date().getTime();
        const kickoff = new Date(match.kickoffTime).getTime();
        const diff = kickoff - now;

        if (diff > 0) {
          const hours = Math.floor(diff / (1000 * 60 * 60));
          const mins = Math.floor((diff / (1000 * 60)) % 60);
          setTimeLeft(`${hours}h ${mins}m`);
        }
      };
      updateTime();
      const timer = setInterval(updateTime, 60000);
      return () => clearInterval(timer);
    }
  }, [match.kickoffTime, match.status]);

  const getStatusBadge = () => {
    if (match.status === "LIVE") {
      return (
        <span className="live-badge">
          <span className="live-dot" />
          LIVE
        </span>
      );
    }
    if (match.status === "COMPLETED") {
      return (
        <span className="inline-flex items-center px-3 py-1 bg-blue-border/20 border border-blue-border/50 rounded-full text-blue-border text-xs font-heading font-bold">
          COMPLETED
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-3 py-1 bg-blue-accent/20 border border-blue-accent/50 rounded-full text-blue-accent text-xs font-heading font-bold">
        UPCOMING
      </span>
    );
  };

  return (
    <div
      className={cn(
        "card-hover p-6 space-y-4 transition-all duration-300",
        match.status === "LIVE" && "border-l-4 border-l-green-500",
        userPrediction && "border-l-4 border-l-gold"
      )}
    >
      {/* Header */}
      <div className="flex justify-between items-center">
        {getStatusBadge()}
        {match.status === "UPCOMING" && timeLeft && (
          <span className="text-xs text-blue-border font-heading">{timeLeft}</span>
        )}
      </div>

      {/* Teams */}
      <div className="flex items-center justify-between gap-4">
        {/* Team A */}
        <div className="flex-1 text-center">
          <div className="text-4xl mb-2">{getFlag(match.teamA)}</div>
          <p className="font-heading font-bold text-sm">{match.teamA}</p>
        </div>

        {/* Score/VS */}
        <div className="flex flex-col items-center gap-2">
          {match.status === "COMPLETED" && match.result ? (
            <div className="font-display text-2xl text-gold">
              {formatScore(match.result.homeScore, match.result.awayScore)}
            </div>
          ) : match.status === "LIVE" ? (
            <div className="font-display text-2xl text-green-400 animate-live-pulse">
              {formatScore(match.result?.homeScore || 0, match.result?.awayScore || 0)}
            </div>
          ) : (
            <div className="font-heading font-bold text-blue-border">VS</div>
          )}
          <div className="text-xs text-blue-border">{formatKickoff(match.kickoffTime)}</div>
        </div>

        {/* Team B */}
        <div className="flex-1 text-center">
          <div className="text-4xl mb-2">{getFlag(match.teamB)}</div>
          <p className="font-heading font-bold text-sm">{match.teamB}</p>
        </div>
      </div>

      {/* Venue */}
      {match.venue && (
        <p className="text-xs text-blue-border text-center">{match.venue}</p>
      )}

      {/* User Prediction Preview */}
      {userPrediction && match.result && (
        <div className="bg-blue-mid/50 rounded-lg p-3 border border-gold/30">
          <div className="flex items-center gap-2 mb-2">
            <Zap size={14} className="text-gold" />
            <span className="text-xs font-heading font-bold text-gold">Your Prediction</span>
          </div>
          <p className="text-sm">
            {userPrediction.homeScore} – {userPrediction.awayScore}
            {userPrediction.cleanSheet && <span className="ml-2 text-xs text-gold">🛡️ Clean Sheet</span>}
          </p>
          <p className="text-xs text-gold font-heading mt-1">+{userPrediction.pointsEarned} pts</p>
        </div>
      )}

      {/* Actions */}
      {showPredictButton && match.status === "UPCOMING" && !isLocked && (
        session?.user ? (
          <Link
            href={`/predictions/${match.id}`}
            className="btn-gold w-full text-center text-sm py-2"
          >
            {userPrediction ? "Edit Prediction" : "Make Prediction"}
          </Link>
        ) : (
          <Link
            href="/auth/login"
            className="btn-outline w-full text-center text-sm py-2"
          >
            Sign in to Predict
          </Link>
        )
      )}
    </div>
  );
}
