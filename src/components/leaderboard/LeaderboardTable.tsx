"use client";

import { LeaderboardEntry } from "@/types";
import { Trophy, Medal, Award } from "lucide-react";
import { cn } from "@/lib/utils";

interface LeaderboardTableProps {
  entries: LeaderboardEntry[];
  currentUserId?: string;
  maxRows?: number;
  compact?: boolean;
}

export function LeaderboardTable({
  entries,
  currentUserId,
  maxRows = 100,
  compact = false,
}: LeaderboardTableProps) {
  const displayEntries = entries.slice(0, maxRows);

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Trophy size={18} className="text-gold" />;
    if (rank === 2) return <Medal size={18} className="text-blue-border" />;
    if (rank === 3) return <Award size={18} className="text-blue-accent" />;
    return <span className="text-xs font-heading font-bold text-blue-border">{rank}</span>;
  };

  const getRowClass = (rank: number) => {
    if (rank === 1) return "leaderboard-row-1";
    if (rank === 2) return "leaderboard-row-2";
    if (rank === 3) return "leaderboard-row-3";
    return "";
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-blue-border">
            <th className="px-4 py-3 text-left font-heading font-bold text-blue-border">#</th>
            <th className="px-4 py-3 text-left font-heading font-bold text-blue-border">Player</th>
            {!compact && (
              <th className="px-4 py-3 text-center font-heading font-bold text-blue-border">
                Predictions
              </th>
            )}
            <th className="px-4 py-3 text-right font-heading font-bold text-gold">Points</th>
          </tr>
        </thead>
        <tbody>
          {displayEntries.map((entry) => (
            <tr
              key={entry.id}
              className={cn(
                "border-b border-blue-border/30 transition-colors hover:bg-blue-mid/20",
                getRowClass(entry.rank),
                currentUserId === entry.id && "bg-gold/5 border-l-4 border-l-gold"
              )}
            >
              <td className="px-4 py-3 text-center font-heading font-bold">
                {getRankIcon(entry.rank)}
              </td>
              <td className="px-4 py-3">
                <div className="flex flex-col">
                  <span className={cn(
                    "font-heading font-bold",
                    currentUserId === entry.id && "text-gold"
                  )}>
                    {entry.username}
                  </span>
                  {entry.fullName && (
                    <span className="text-xs text-blue-border">{entry.fullName}</span>
                  )}
                </div>
              </td>
              {!compact && (
                <td className="px-4 py-3 text-center text-blue-border">
                  {entry.predictions}
                </td>
              )}
              <td className="px-4 py-3 text-right">
                <span className="font-display text-lg text-gold">{entry.totalPoints}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
