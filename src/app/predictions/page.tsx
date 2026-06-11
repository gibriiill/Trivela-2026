import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function PredictionsPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/auth/login");
  }

  const [predictions, stats] = await Promise.all([
    prisma.prediction.findMany({
      where: { userId: session.user.id },
      include: { match: { include: { result: true } } },
      orderBy: { createdAt: "desc" },
    }),
    prisma.$queryRaw`
      SELECT 
        COUNT(*) as submitted,
        SUM(CASE WHEN "isCalculated" = true THEN 1 ELSE 0 END) as calculated,
        SUM("pointsEarned") as totalPoints
      FROM predictions 
      WHERE "userId" = ${session.user.id}
    `,
  ]);

  const raw = (stats as any)[0] || {};
const stats_data = {
  submitted: Number(raw.submitted ?? 0),
  calculated: Number(raw.calculated ?? 0),
  totalPoints: Number(raw.totalpoints ?? 0),
};
  const unpredicted = await prisma.match.findMany({
    where: {
      status: "UPCOMING",
      predictions: { none: { userId: session.user.id } },
    },
    include: { result: true },
    orderBy: { kickoffTime: "asc" },
    take: 5,
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 space-y-12">
      <div className="space-y-4">
        <h1 className="font-display text-4xl text-gold-gradient">My Predictions</h1>
        <p className="text-blue-border">Track and manage your contest predictions</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card-dark p-6 space-y-2 border-l-4 border-l-gold">
          <p className="text-sm text-blue-border font-heading">Submitted</p>
          <p className="font-display text-3xl text-gold">{stats_data.submitted || 0}</p>
        </div>
        <div className="card-dark p-6 space-y-2 border-l-4 border-l-gold">
          <p className="text-sm text-blue-border font-heading">Awaiting Result</p>
          <p className="font-display text-3xl text-gold">{(stats_data.submitted || 0) - (stats_data.calculated || 0)}</p>
        </div>
        <div className="card-dark p-6 space-y-2 border-l-4 border-l-gold">
          <p className="text-sm text-blue-border font-heading">Points Earned</p>
          <p className="font-display text-3xl text-gold">{stats_data.totalPoints || 0}</p>
        </div>
      </div>

      {/* Unpredicted Matches */}
      {unpredicted.length > 0 && (
        <section className="space-y-4">
          <h2 className="font-display text-2xl text-gold-gradient">Next Matches to Predict</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {unpredicted.map((match) => (
              <Link
                key={match.id}
                href={`/predictions/${match.id}`}
                className="card-hover p-4 block hover:scale-105 transition-transform"
              >
                <p className="font-heading font-bold">{match.teamA} vs {match.teamB}</p>
                <p className="text-sm text-blue-border">Make Prediction →</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* My Predictions */}
      {predictions.length > 0 ? (
        <section className="space-y-4">
          <h2 className="font-display text-2xl text-gold-gradient">Your Predictions</h2>
          <div className="space-y-3">
            {predictions.map((pred) => (
              <div key={pred.id} className="card-dark p-4 flex items-center justify-between">
                <div>
                  <p className="font-heading font-bold">{pred.match.teamA} vs {pred.match.teamB}</p>
                  <p className="text-sm text-blue-border">Your prediction: {pred.homeScore} – {pred.awayScore}</p>
                </div>
                {pred.match.result ? (
                  <div className="text-right">
                    <p className="font-display text-xl text-gold">{pred.pointsEarned} pts</p>
                    <p className="text-xs text-blue-border">
                      {pred.pointsEarned > 0 ? "✓" : "✗"} {pred.isCalculated ? "Calculated" : "Pending"}
                    </p>
                  </div>
                ) : (
                  <Link
                    href={`/predictions/${pred.matchId}`}
                    className="btn-outline text-xs px-3 py-1"
                  >
                    Edit
                  </Link>
                )}
              </div>
            ))}
          </div>
        </section>
      ) : (
        <div className="card-dark p-12 text-center space-y-4">
          <p className="text-blue-border">No predictions yet</p>
          <Link href="/matches" className="btn-gold px-6 py-3 inline-block">
            Browse Matches
          </Link>
        </div>
      )}
    </div>
  );
}
