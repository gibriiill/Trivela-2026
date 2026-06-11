import { prisma } from "@/lib/prisma";
import { COUNTRY_FLAGS } from "@/types";
import { getGroupStandings } from "@/app/groups/helpers";

export const dynamic = "force-dynamic";

type GroupTeam = {
  team: string;
  group: string;
};

type TeamStanding = GroupTeam & {
  played: number;
  wins: number;
  draws: number;
  losses: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
};

const groupStandings: Record<string, GroupTeam[]> = {
  A: [
    { team: "Mexico", group: "A" },
    { team: "South Africa", group: "A" },
    { team: "South Korea", group: "A" },
    { team: "Czechia", group: "A" },
  ],
  B: [
    { team: "Canada", group: "B" },
    { team: "Bosnia and Herzegovina", group: "B" },
    { team: "Qatar", group: "B" },
    { team: "Switzerland", group: "B" },
  ],
  C: [
    { team: "Brazil", group: "C" },
    { team: "Morocco", group: "C" },
    { team: "Haiti", group: "C" },
    { team: "Scotland", group: "C" },
  ],
  D: [
    { team: "United States", group: "D" },
    { team: "Paraguay", group: "D" },
    { team: "Australia", group: "D" },
    { team: "Türkiye", group: "D" },
  ],
  E: [
    { team: "Germany", group: "E" },
    { team: "Curaçao", group: "E" },
    { team: "Ivory Coast", group: "E" },
    { team: "Ecuador", group: "E" },
  ],
  F: [
    { team: "Netherlands", group: "F" },
    { team: "Japan", group: "F" },
    { team: "Sweden", group: "F" },
    { team: "Tunisia", group: "F" },
  ],
  G: [
    { team: "Belgium", group: "G" },
    { team: "Egypt", group: "G" },
    { team: "Iran", group: "G" },
    { team: "New Zealand", group: "G" },
  ],
  H: [
    { team: "Spain", group: "H" },
    { team: "Cape Verde", group: "H" },
    { team: "Saudi Arabia", group: "H" },
    { team: "Uruguay", group: "H" },
  ],
  I: [
    { team: "France", group: "I" },
    { team: "Senegal", group: "I" },
    { team: "Iraq", group: "I" },
    { team: "Norway", group: "I" },
  ],
  J: [
    { team: "Argentina", group: "J" },
    { team: "Algeria", group: "J" },
    { team: "Austria", group: "J" },
    { team: "Jordan", group: "J" },
  ],
  K: [
    { team: "Portugal", group: "K" },
    { team: "DR Congo", group: "K" },
    { team: "Uzbekistan", group: "K" },
    { team: "Colombia", group: "K" },
  ],
  L: [
    { team: "England", group: "L" },
    { team: "Croatia", group: "L" },
    { team: "Ghana", group: "L" },
    { team: "Panama", group: "L" },
  ],
};

export default async function GroupsPage({
  searchParams,
}: {
  searchParams: { group?: string };
}) {
  const selectedGroup = (searchParams.group || "A") as string;
  const teams = groupStandings[selectedGroup as keyof typeof groupStandings] || [];

  const completedMatches = await prisma.match.findMany({
    where: {
      stage: "GROUP",
      group: selectedGroup,
      status: "COMPLETED",
      result: {
        isNot: null,
      },
    },
    include: {
      result: true,
    },
  });

  const standings = getGroupStandings(
    teams.map((team) => team.team),
    completedMatches.map((match) => ({
      teamA: match.teamA,
      teamB: match.teamB,
      group: match.group,
      stage: match.stage,
      result: match.result,
    }))
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 space-y-8">
      <div className="space-y-4">
        <h1 className="font-display text-4xl text-gold-gradient">Group Stage</h1>
        <p className="text-blue-border">FIFA World Cup 2026 group standings</p>
      </div>

      {/* Group Tabs */}
      <div className="flex flex-wrap gap-2">
        {Object.keys(groupStandings).map((g) => (
          <a
            key={g}
            href={`?group=${g}`}
            className={`font-heading font-bold px-4 py-2 rounded-lg transition-all ${
              g === selectedGroup
                ? "bg-gold text-blue-deep"
                : "bg-blue-mid border border-blue-border hover:border-gold"
            }`}
          >
            Group {g}
          </a>
        ))}
      </div>

      {/* Standings Table */}
      <div className="card-dark overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-blue-border bg-blue-mid">
              <th className="px-4 py-3 text-left font-heading font-bold">#</th>
              <th className="px-4 py-3 text-left font-heading font-bold">Team</th>
              <th className="px-4 py-3 text-center font-heading font-bold">P</th>
              <th className="px-4 py-3 text-center font-heading font-bold">W</th>
              <th className="px-4 py-3 text-center font-heading font-bold">D</th>
              <th className="px-4 py-3 text-center font-heading font-bold">L</th>
              <th className="px-4 py-3 text-center font-heading font-bold">GF</th>
              <th className="px-4 py-3 text-center font-heading font-bold">GA</th>
              <th className="px-4 py-3 text-center font-heading font-bold">GD</th>
              <th className="px-4 py-3 text-right font-heading font-bold">PTS</th>
            </tr>
          </thead>
          <tbody>
            {standings.map((team, idx) => (
              <tr
                key={team.team}
                className={`border-b border-blue-border/30 ${
                  idx < 2 ? "border-l-4 border-l-green-500" : ""
                }`}
              >
                <td className="px-4 py-3 font-heading font-bold text-blue-border">{idx + 1}</td>
                <td className="px-4 py-3">
                  <span className="inline-flex items-center gap-2">
                    <span className="text-2xl">{COUNTRY_FLAGS[team.team] || "🏳️"}</span>
                    <span className="font-heading font-bold">{team.team}</span>
                  </span>
                </td>
                <td className="px-4 py-3 text-center text-blue-border">{team.played}</td>
                <td className="px-4 py-3 text-center text-blue-border">{team.wins}</td>
                <td className="px-4 py-3 text-center text-blue-border">{team.draws}</td>
                <td className="px-4 py-3 text-center text-blue-border">{team.losses}</td>
                <td className="px-4 py-3 text-center text-blue-border">{team.goalsFor}</td>
                <td className="px-4 py-3 text-center text-blue-border">{team.goalsAgainst}</td>
                <td className="px-4 py-3 text-center text-blue-border">{team.goalDifference}</td>
                <td className="px-4 py-3 text-right font-heading font-bold text-gold">{team.points}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="card-dark p-6 text-sm text-blue-border">
        <p>
          <strong>Advancement Rules:</strong> Top 2 teams from each group advance to the Round of 16.
        </p>
      </div>
    </div>
  );
}
