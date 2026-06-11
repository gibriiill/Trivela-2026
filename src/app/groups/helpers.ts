import { MatchResult } from "@/types";

type GroupMatch = {
  teamA: string;
  teamB: string;
  group?: string | null;
  stage: string;
  result?: {
    homeScore: number;
    awayScore: number;
  } | null;
};

type Standing = {
  team: string;
  group: string;
  played: number;
  wins: number;
  draws: number;
  losses: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
};

export function getGroupStandings(teams: string[], matches: GroupMatch[]) {
  const standings: Record<string, Standing> = {};

  teams.forEach((team) => {
    standings[team] = {
      team,
      group: matches.find((m) => m.teamA === team || m.teamB === team)?.group || "",
      played: 0,
      wins: 0,
      draws: 0,
      losses: 0,
      goalsFor: 0,
      goalsAgainst: 0,
      goalDifference: 0,
      points: 0,
    };
  });

  matches.forEach((match) => {
    if (!match.group || match.stage !== "GROUP" || !match.result) return;
    const home = standings[match.teamA];
    const away = standings[match.teamB];
    if (!home || !away) return;

    home.played += 1;
    away.played += 1;
    home.goalsFor += match.result.homeScore;
    home.goalsAgainst += match.result.awayScore;
    away.goalsFor += match.result.awayScore;
    away.goalsAgainst += match.result.homeScore;

    if (match.result.homeScore > match.result.awayScore) {
      home.wins += 1;
      home.points += 3;
      away.losses += 1;
    } else if (match.result.homeScore < match.result.awayScore) {
      away.wins += 1;
      away.points += 3;
      home.losses += 1;
    } else {
      home.draws += 1;
      away.draws += 1;
      home.points += 1;
      away.points += 1;
    }

    home.goalDifference = home.goalsFor - home.goalsAgainst;
    away.goalDifference = away.goalsFor - away.goalsAgainst;
  });

  return Object.values(standings).sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    if (b.goalDifference !== a.goalDifference) return b.goalDifference - a.goalDifference;
    if (b.goalsFor !== a.goalsFor) return b.goalsFor - a.goalsFor;
    return a.team.localeCompare(b.team);
  });
}
