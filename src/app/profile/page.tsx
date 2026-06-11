import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/auth/login");
  }

  const [user, rank] = await Promise.all([
    prisma.user.findUnique({
      where: { id: session.user.id },
      include: { _count: { select: { predictions: true } } },
    }),
    prisma.user.count({
      where: { role: "USER", totalPoints: { gt: session.user.totalPoints } },
    }),
  ]);

  if (!user) {
    redirect("/auth/login");
  }

  const perfectPicks = await prisma.prediction.count({
    where: { userId: session.user.id, pointsEarned: 45 },
  });

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-8">
      <div className="card-dark p-8 space-y-6 border-t-4 border-t-gold">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-gold/20 border-2 border-gold mx-auto flex items-center justify-center mb-4">
            <span className="font-display text-3xl text-gold">
              {session.user.username?.charAt(0).toUpperCase()}
            </span>
          </div>
          <h1 className="font-display text-3xl text-gold-gradient">{user.username}</h1>
          {user.fullName && <p className="text-blue-border">{user.fullName}</p>}
        </div>

        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="font-display text-2xl text-gold">#{rank + 1}</p>
            <p className="text-xs text-blue-border font-heading">Rank</p>
          </div>
          <div>
            <p className="font-display text-2xl text-gold">{user.totalPoints}</p>
            <p className="text-xs text-blue-border font-heading">Points</p>
          </div>
          <div>
            <p className="font-display text-2xl text-gold">{user._count.predictions}</p>
            <p className="text-xs text-blue-border font-heading">Predictions</p>
          </div>
        </div>
      </div>

      <div className="card-dark p-8 space-y-6">
        <h2 className="font-display text-2xl text-gold-gradient">Personal Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            { label: "Full Name", value: user.fullName },
            { label: "Email", value: user.email },
            { label: "College", value: user.college },
            { label: "Department", value: user.department },
            { label: "Year", value: user.year },
            { label: "Mobile", value: user.mobile },
          ].map((item) => (
            <div key={item.label}>
              <p className="text-sm text-blue-border font-heading">{item.label}</p>
              <p className="font-heading font-bold">{item.value || "—"}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="card-dark p-8 space-y-4">
        <h2 className="font-display text-2xl text-gold-gradient">Achievements</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-gold/10 rounded-lg text-center">
            <p className="font-display text-3xl text-gold">{perfectPicks}</p>
            <p className="text-xs text-blue-border font-heading">Perfect Picks (45 pts)</p>
          </div>
        </div>
      </div>
    </div>
  );
}
