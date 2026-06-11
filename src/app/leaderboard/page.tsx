import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Trophy, Medal, Award } from "lucide-react";
import { LeaderboardTable } from "@/components/leaderboard/LeaderboardTable";

export const dynamic = "force-dynamic";

export default async function LeaderboardPage() {
  const [leaderboard, session] = await Promise.all([
    prisma.user.findMany({
      where: {
        role: "USER",
        predictions: { some: {} },
      },
      select: {
        id: true,
        username: true,
        fullName: true,
        college: true,
        totalPoints: true,
        _count: { select: { predictions: true } },
      },
      orderBy: [{ totalPoints: "desc" }, { username: "asc" }],
    }),
    auth(),
  ]);

  const entries = leaderboard.map((user, index) => ({
    ...user,
    rank: index + 1,
    predictions: user._count.predictions,
  }));

  const currentUserRank = entries.find((e) => e.id === session?.user?.id);

  const podium = entries.slice(0, 3);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 space-y-12">
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <Trophy className="text-gold" size={36} />
          <h1 className="font-display text-4xl text-gold-gradient">Leaderboard</h1>
        </div>
        <p className="text-blue-border">Top predictors in FIFA World Cup 2026 contest</p>
      </div>

      {/* Current User Rank */}
      {currentUserRank && currentUserRank.rank > 3 && (
        <div className="card-dark p-6 border-l-4 border-l-gold space-y-2">
          <p className="text-sm text-blue-border font-heading">YOUR RANK</p>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-heading font-bold">{currentUserRank.username}</p>
              <p className="text-sm text-blue-border">{currentUserRank.fullName}</p>
            </div>
            <div className="text-right">
              <p className="font-display text-2xl text-gold">#{currentUserRank.rank}</p>
              <p className="font-display text-xl text-gold">{currentUserRank.totalPoints} pts</p>
            </div>
          </div>
        </div>
      )}

      {/* Podium */}
      {podium.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {podium.map((entry) => {
            const isCurrentUser = entry.id === session?.user?.id;
            const heights = { 1: "h-40", 2: "h-32", 3: "h-24" };
            const colors = { 1: "gold", 2: "blue-border", 3: "blue-accent" };
            const icons = { 1: Trophy, 2: Medal, 3: Award };

            const Icon = icons[entry.rank as keyof typeof icons];
            const height = heights[entry.rank as keyof typeof heights];
            const color = colors[entry.rank as keyof typeof colors];

            return (
              <div key={entry.id} className="flex flex-col items-center gap-4">
                <div
                  className={`card-dark border-t-4 border-${color} w-full ${height} flex flex-col items-center justify-center p-6 text-center space-y-3 transition-all ${
                    isCurrentUser && "border border-gold"
                  }`}
                >
                  <Icon size={32} className={`text-${color}`} />
                  <div>
                    <p className="font-heading font-bold">{entry.username}</p>
                    <p className="text-sm text-blue-border">{entry.fullName}</p>
                  </div>
                  <p className="font-display text-2xl text-gold">{entry.totalPoints}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Full Leaderboard */}
      <div className="card-dark p-6 overflow-hidden">
        <h2 className="font-display text-2xl text-gold-gradient mb-6">Rankings</h2>
        <LeaderboardTable entries={entries} currentUserId={session?.user?.id} />
      </div>
    </div>
  );
}
