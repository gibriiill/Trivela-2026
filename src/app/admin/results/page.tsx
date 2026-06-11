import { prisma } from "@/lib/prisma";
import AdminResultsPanel from "@/components/admin/AdminResultsPanel";

export const dynamic = "force-dynamic";

export default async function AdminResultsPage() {
  const pendingMatches = await prisma.match.findMany({
    where: { status: "COMPLETED", result: null },
    orderBy: { kickoffTime: "asc" },
    select: {
      id: true,
      teamA: true,
      teamB: true,
      kickoffTime: true,
      stage: true,
      venue: true,
    },
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 space-y-8">
      <div className="space-y-4">
        <h1 className="font-display text-4xl text-gold-gradient">Manage Results</h1>
        <p className="text-blue-border">Publish match results and calculate player points</p>
      </div>

      <AdminResultsPanel
        matches={pendingMatches.map((match) => ({
          ...match,
          kickoffTime: match.kickoffTime.toISOString(),
        }))}
      />
    </div>
  );
}
