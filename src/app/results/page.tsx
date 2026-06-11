import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function ResultsPage() {
  const matches = await prisma.match.findMany({
    where: { status: "COMPLETED", result: { isNot: null } },
    include: { result: true },
    orderBy: { kickoffTime: "desc" },
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 space-y-8">
      <h1 className="font-display text-4xl text-gold-gradient">Match Results</h1>
      <div className="space-y-4">
        {matches.map((match) => (
          <div key={match.id} className="card-dark p-6 flex items-center justify-between">
            <div className="flex-1">
              <p className="font-heading font-bold">{match.teamA} vs {match.teamB}</p>
              {match.result && (
                <p className="text-gold text-lg">
                  {match.result.homeScore} – {match.result.awayScore}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
