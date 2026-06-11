import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      username: true,
      email: true,
      fullName: true,
      year: true,
      department: true,
      mobile: true,
      college: true,
      totalPoints: true,
      role: true,
      createdAt: true,
      _count: { select: { predictions: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 space-y-8">
      <div className="space-y-4">
        <h1 className="font-display text-4xl text-gold-gradient">Users</h1>
        <p className="text-blue-border">{users.length} users registered</p>
      </div>

      <div className="overflow-x-auto card-dark">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-blue-border bg-blue-mid">
              <th className="px-4 py-3 text-left font-heading font-bold">#</th>
              <th className="px-4 py-3 text-left font-heading font-bold">Username</th>
              <th className="px-4 py-3 text-left font-heading font-bold">Email</th>
              <th className="px-4 py-3 text-left font-heading font-bold">Full Name</th>
              <th className="px-4 py-3 text-left font-heading font-bold">College</th>
              <th className="px-4 py-3 text-center font-heading font-bold">Predictions</th>
              <th className="px-4 py-3 text-right font-heading font-bold">Points</th>
              <th className="px-4 py-3 text-center font-heading font-bold">Role</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, idx) => (
              <tr key={user.id} className="border-b border-blue-border/30 hover:bg-blue-mid/20">
                <td className="px-4 py-3 text-blue-border font-heading font-bold">{idx + 1}</td>
                <td className="px-4 py-3 font-heading font-bold">{user.username}</td>
                <td className="px-4 py-3 text-blue-border text-sm">{user.email}</td>
                <td className="px-4 py-3 text-sm">{user.fullName || "—"}</td>
                <td className="px-4 py-3 text-sm text-blue-border">{user.college || "—"}</td>
                <td className="px-4 py-3 text-center text-blue-border">{user._count.predictions}</td>
                <td className="px-4 py-3 text-right">
                  <span className="font-display text-gold">{user.totalPoints}</span>
                </td>
                <td className="px-4 py-3 text-center">
                  <span
                    className={`text-xs font-heading font-bold px-2 py-1 rounded ${
                      user.role === "ADMIN"
                        ? "bg-gold/20 text-gold"
                        : "bg-blue-border/20 text-blue-border"
                    }`}
                  >
                    {user.role}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
