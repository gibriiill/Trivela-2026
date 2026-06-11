import Link from "next/link";
import { CountdownTimer } from "@/components/ui/CountdownTimer";
import { MatchCard } from "@/components/match/MatchCard";
import { LeaderboardTable } from "@/components/leaderboard/LeaderboardTable";
import { Zap, Trophy, Users, BarChart3, Zap as Lightning } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export const dynamic = "force-dynamic";

export default async function Home() {
  const session = await auth();

  const [userCount, predCount, matchCount, upcomingMatches, leaders] = await Promise.all([
    prisma.user.count({ where: { role: "USER" } }),
    prisma.prediction.count(),
    prisma.match.count({ where: { status: "COMPLETED" } }),
    prisma.match.findMany({
      where: { status: "UPCOMING" },
      include: { result: true },
      orderBy: { kickoffTime: "asc" },
      take: 4,
    }),
    prisma.user.findMany({
      where: {
        role: "USER",
        predictions: { some: {} },
      },
      select: {
        id: true,
        username: true,
        fullName: true,
        totalPoints: true,
        _count: { select: { predictions: true } },
      },
      orderBy: [{ totalPoints: "desc" }, { username: "asc" }],
      take: 5,
    }),
  ]);

  const leaderboardEntries = leaders.map((l, i) => ({
    ...l,
    rank: i + 1,
    predictions: l._count.predictions,
  }));

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-stadium opacity-10" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-blue-deep" />

        <div className="relative max-w-7xl mx-auto text-center space-y-6 z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gold/10 border border-gold/30 rounded-full">
            <Zap size={14} className="text-gold" />
            <span className="text-sm font-heading font-bold text-gold">Official Contest</span>
          </div>

          <h1 className="font-display text-5xl md:text-7xl text-gold-gradient">TRIVELA</h1>
          <p className="text-xl md:text-2xl text-blue-border font-heading">
            2026 FIFA World Cup Prediction Contest
          </p>

          <p className="text-lg text-blue-border max-w-2xl mx-auto">
            Predict match results, compete with millions of fans, and climb the leaderboard. Test
            your football knowledge!
          </p>

          <div className="pt-8">
            <CountdownTimer targetDate={new Date("2026-06-11T18:00:00Z")} />
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
            <Link href="/auth/register" className="btn-gold px-8 py-4 text-lg font-bold">
              Join the Contest
            </Link>
            <Link href="/matches" className="btn-outline px-8 py-4 text-lg font-bold">
              Browse Matches
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-blue-mid py-8 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="space-y-2">
            <Users size={32} className="mx-auto text-gold" />
            <p className="font-display text-3xl text-gold">{Number(userCount).toLocaleString()}</p>
            <p className="text-sm text-blue-border font-heading">Participants</p>
          </div>
          <div className="space-y-2">
            <Lightning size={32} className="mx-auto text-gold" />
            <p className="font-display text-3xl text-gold">{predCount.toLocaleString()}</p>
            <p className="text-sm text-blue-border font-heading">Predictions Made</p>
          </div>
          <div className="space-y-2">
            <BarChart3 size={32} className="mx-auto text-gold" />
            <p className="font-display text-3xl text-gold">{matchCount}</p>
            <p className="text-sm text-blue-border font-heading">Matches Completed</p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto space-y-12">
          <h2 className="font-display text-4xl text-center text-gold-gradient">How It Works</h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { step: 1, title: "Create Account", desc: "Join the contest with your email" },
              { step: 2, title: "Make Predictions", desc: "Predict scores for each match" },
              { step: 3, title: "Earn Points", desc: "Gain points for accurate predictions" },
              { step: 4, title: "Climb Leaderboard", desc: "Compete with millions of fans" },
            ].map((item) => (
              <div key={item.step} className="text-center space-y-4">
                <div className="w-12 h-12 mx-auto bg-gold rounded-full flex items-center justify-center">
                  <span className="font-display text-2xl text-blue-deep">{item.step}</span>
                </div>
                <h3 className="font-heading font-bold">{item.title}</h3>
                <p className="text-sm text-blue-border">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Points System */}
      <section className="py-16 px-4 bg-blue-mid">
        <div className="max-w-7xl mx-auto space-y-12">
          <h2 className="font-display text-4xl text-center text-gold-gradient">Points System</h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { pts: "10", label: "Correct Result" },
              { pts: "20", label: "Correct Score" },
              { pts: "5", label: "Clean Sheet" },
              { pts: "+10", label: "Perfect Bonus" },
            ].map((item, i) => (
              <div
                key={i}
                className="card-dark p-6 text-center space-y-4 border-2 border-gold/20 hover:border-gold/50 transition-all"
              >
                <p className="font-display text-5xl text-gold">{item.pts}</p>
                <p className="font-heading font-bold text-sm">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming Matches */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto space-y-8">
          <h2 className="font-display text-4xl text-center text-gold-gradient">Upcoming Matches</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {upcomingMatches.map((match) => (
              <MatchCard key={match.id} match={match} showPredictButton={false} />
            ))}
          </div>

          <div className="text-center">
            <Link href="/matches" className="btn-outline px-8 py-3">
              View All Matches
            </Link>
          </div>
        </div>
      </section>

      {/* Leaderboard Preview */}
      <section className="py-16 px-4 bg-blue-mid">
        <div className="max-w-7xl mx-auto space-y-8">
          <h2 className="font-display text-4xl text-center text-gold-gradient">Top Predictors</h2>

          <div className="card-dark p-6 overflow-hidden">
            <LeaderboardTable
              entries={leaderboardEntries}
              currentUserId={session?.user?.id}
              compact
            />
          </div>

          <div className="text-center">
            <Link href="/leaderboard" className="btn-gold px-8 py-3">
              View Full Leaderboard
            </Link>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="card-dark border-2 border-gold p-12 text-center space-y-6">
            <h2 className="font-display text-3xl">Ready to Predict?</h2>
            <p className="text-blue-border">
              Join thousands of fans predicting the 2026 FIFA World Cup
            </p>

            {session?.user ? (
              <Link href="/matches" className="btn-gold px-8 py-3 inline-block">
                Make Your First Prediction
              </Link>
            ) : (
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/auth/register" className="btn-gold px-8 py-3">
                  Register Now
                </Link>
                <Link href="/auth/login" className="btn-outline px-8 py-3">
                  Sign In
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}