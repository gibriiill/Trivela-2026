import { prisma } from "@/lib/prisma";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const [users, predictions, matches, liveMatches] = await Promise.all([
    prisma.user.count(),
    prisma.prediction.count(),
    prisma.match.count(),
    prisma.match.findMany({
      where: { status: "LIVE" },
      orderBy: { kickoffTime: "asc" },
      take: 5,
    }),
  ]);

  const completedWithoutResults = await prisma.match.count({
    where: { status: "COMPLETED", result: null },
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 space-y-12">
      <h1 className="font-display text-4xl text-gold-gradient">Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: "Users", value: users },
          { label: "Predictions", value: predictions },
          { label: "Matches", value: matches },
          { label: "Pending Results", value: completedWithoutResults },
        ].map((stat) => (
          <div
            key={stat.label}
            className="card-dark p-6 border-t-4 border-t-gold text-center space-y-2"
          >
            <p className="text-blue-border font-heading text-sm">{stat.label}</p>
            <p className="font-display text-3xl text-gold">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Alerts */}
      {completedWithoutResults > 0 && (
        <div className="card-dark border-l-4 border-l-orange-500 p-6 space-y-4">
          <p className="font-heading font-bold text-orange-400">
            ⚠️ {completedWithoutResults} completed matches missing results
          </p>
          <Link href="/admin/results" className="btn-gold px-6 py-2 inline-block">
            Publish Results
          </Link>
        </div>
      )}

      {/* Live Matches */}
      {liveMatches.length > 0 && (
        <section className="space-y-4">
          <h2 className="font-display text-2xl text-gold-gradient">🔴 Live Matches</h2>
          <div className="space-y-3">
            {liveMatches.map((match) => (
              <div key={match.id} className="card-dark p-4 border-l-4 border-l-green-500">
                <p className="font-heading font-bold">
                  {match.teamA} vs {match.teamB}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Quick Actions */}
      <section className="space-y-4">
        <h2 className="font-display text-2xl text-gold-gradient">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { href: "/admin/matches", label: "Manage Matches", action: "Add / Edit / Delete" },
            { href: "/admin/results", label: "Publish Results", action: "Score & Calculate Points" },
            { href: "/admin/users", label: "View Users", action: "List & Export" },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="card-hover p-6 space-y-2 block"
            >
              <p className="font-heading font-bold text-gold">{item.label}</p>
              <p className="text-sm text-blue-border">{item.action}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
