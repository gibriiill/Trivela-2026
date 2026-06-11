import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { MatchCard } from "@/components/match/MatchCard";
import { Zap } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function MatchesPage() {
  const [matches, session] = await Promise.all([
    prisma.match.findMany({
      include: { result: true, _count: { select: { predictions: true } } },
      orderBy: { kickoffTime: "asc" },
    }),
    auth(),
  ]);

  const userPredictions = session?.user?.id
    ? await prisma.prediction.findMany({
        where: { userId: session.user.id },
        select: { matchId: true, id: true },
      })
    : [];

  const predictionsByMatch = new Map(userPredictions.map((p) => [p.matchId, p]));

  const groupedMatches = {
    live: matches.filter((m) => m.status === "LIVE"),
    upcoming: matches.filter((m) => m.status === "UPCOMING"),
    completed: matches.filter((m) => m.status === "COMPLETED"),
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 space-y-12">
      <div className="space-y-4">
        <h1 className="font-display text-4xl text-gold-gradient">World Cup Matches</h1>
        <p className="text-blue-border">Browse and predict all FIFA World Cup 2026 matches</p>
      </div>

      {matches.length === 0 ? (
        <div className="card-dark p-12 text-center space-y-4">
          <p className="text-blue-border">No matches available yet</p>
          {session?.user?.role === "ADMIN" && (
            <Link href="/admin/matches" className="btn-gold px-6 py-3 inline-block">
              Add Matches
            </Link>
          )}
        </div>
      ) : (
        <>
          {/* Live Matches */}
          {groupedMatches.live.length > 0 && (
            <section className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="live-dot" />
                <h2 className="font-display text-2xl text-green-400">Live Now</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {groupedMatches.live.map((match) => (
                  <MatchCard
                    key={match.id}
                    match={match}
                    userPrediction={predictionsByMatch.get(match.id) as any}
                  />
                ))}
              </div>
            </section>
          )}

          {/* Upcoming Matches */}
          {groupedMatches.upcoming.length > 0 && (
            <section className="space-y-6">
              <h2 className="font-display text-2xl text-gold-gradient">Upcoming</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {groupedMatches.upcoming.map((match) => (
                  <MatchCard
                    key={match.id}
                    match={match}
                    userPrediction={predictionsByMatch.get(match.id) as any}
                  />
                ))}
              </div>
            </section>
          )}

          {/* Completed Matches */}
          {groupedMatches.completed.length > 0 && (
            <section className="space-y-6">
              <h2 className="font-display text-2xl text-blue-border">Results</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {groupedMatches.completed.map((match) => (
                  <MatchCard
                    key={match.id}
                    match={match}
                    userPrediction={predictionsByMatch.get(match.id) as any}
                    showPredictButton={false}
                  />
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
}
