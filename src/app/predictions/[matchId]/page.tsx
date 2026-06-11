import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import PredictionForm from "@/components/predictions/PredictionForm";

export const dynamic = "force-dynamic";

export default async function PredictionMatchPage({ params }: { params: { matchId: string } }) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/auth/login");
  }

  const match = await prisma.match.findUnique({
    where: { id: params.matchId },
    include: { result: true },
  });

  if (!match) {
    notFound();
  }

  const existingPrediction = await prisma.prediction.findUnique({
    where: {
      userId_matchId: {
        userId: session.user.id,
        matchId: params.matchId,
      },
    },
  });

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-8">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-4xl text-gold-gradient">Predict Match</h1>
          <p className="text-blue-border">Enter your score prediction before kickoff.</p>
        </div>
        <Link href="/predictions" className="btn-outline px-4 py-2 text-sm">
          Back to My Predictions
        </Link>
      </div>

      <div className="card-dark p-6">
        <PredictionForm
          match={{
            ...match,
            kickoffTime: match.kickoffTime.toISOString(),
          }}
          existingPrediction={existingPrediction}
        />
      </div>
    </div>
  );
}
