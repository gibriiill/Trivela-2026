export type Role = "USER" | "ADMIN";
export type MatchStatus = "UPCOMING" | "LIVE" | "COMPLETED";
export type MatchStage = "GROUP" | "ROUND_OF_16" | "QUARTER_FINAL" | "SEMI_FINAL" | "THIRD_PLACE" | "FINAL";
export type MatchResult = "HOME" | "AWAY" | "DRAW";

export interface User {
  id: string;
  username: string;
  email: string;
  fullName?: string;
  year?: string;
  department?: string;
  mobile?: string;
  college?: string;
  totalPoints: number;
  role: Role;
  createdAt: Date;
  updatedAt: Date;
}

export interface Match {
  id: string;
  teamA: string;
  teamB: string;
  teamAFlag?: string;
  teamBFlag?: string;
  group?: string;
  stage: MatchStage;
  venue?: string;
  kickoffTime: Date;
  status: MatchStatus;
  createdAt: Date;
  updatedAt: Date;
  result?: Result;
  _count?: {
    predictions: number;
  };
}

export interface Prediction {
  id: string;
  userId: string;
  matchId: string;
  resultPrediction: MatchResult;
  homeScore: number;
  awayScore: number;
  cleanSheet: boolean;
  pointsEarned: number;
  isCalculated: boolean;
  createdAt: Date;
  updatedAt: Date;
  match?: Match;
  user?: User;
}

export interface Result {
  id: string;
  matchId: string;
  homeScore: number;
  awayScore: number;
  winningTeam: MatchResult;
  cleanSheet: boolean;
  publishedAt: Date;
}

export interface LeaderboardEntry {
  id: string;
  username: string;
  fullName?: string;
  totalPoints: number;
  rank: number;
  predictions: number;
  college?: string;
}

export interface ScoreCalculation {
  resultPoints: number;
  scorePoints: number;
  cleanSheetPoints: number;
  bonusPoints: number;
  total: number;
}

export const STAGE_LABELS: Record<MatchStage, string> = {
  GROUP: "Group Stage",
  ROUND_OF_16: "Round of 16",
  QUARTER_FINAL: "Quarter Final",
  SEMI_FINAL: "Semi Final",
  THIRD_PLACE: "Third Place",
  FINAL: "Final",
};

export const COUNTRY_FLAGS: Record<string, string> = {
  // Group A
  Mexico: "🇲🇽",
  "South Africa": "🇿🇦",
  "South Korea": "🇰🇷",
  Czechia: "🇨🇿",
  // Group B
  Canada: "🇨🇦",
  "Bosnia and Herzegovina": "🇧🇦",
  Qatar: "🇶🇦",
  Switzerland: "🇨🇭",
  // Group C
  Brazil: "🇧🇷",
  Morocco: "🇲🇦",
  Haiti: "🇭🇹",
  Scotland: "🏴󠁧󠁢󠁳󠁣󠁴󠁿",
  // Group D
  "United States": "🇺🇸",
  Paraguay: "🇵🇾",
  Australia: "🇦🇺",
  Türkiye: "🇹🇷",
  // Group E
  Germany: "🇩🇪",
  Curaçao: "🇨🇼",
  "Ivory Coast": "🇨🇮",
  Ecuador: "🇪🇨",
  // Group F
  Netherlands: "🇳🇱",
  Japan: "🇯🇵",
  Sweden: "🇸🇪",
  Tunisia: "🇹🇳",
  // Group G
  Belgium: "🇧🇪",
  Egypt: "🇪🇬",
  Iran: "🇮🇷",
  "New Zealand": "🇳🇿",
  // Group H
  Spain: "🇪🇸",
  "Cape Verde": "🇨🇻",
  "Saudi Arabia": "🇸🇦",
  Uruguay: "🇺🇾",
  // Group I
  France: "🇫🇷",
  Senegal: "🇸🇳",
  Iraq: "🇮🇶",
  Norway: "🇳🇴",
  // Group J
  Argentina: "🇦🇷",
  Algeria: "🇩🇿",
  Austria: "🇦🇹",
  Jordan: "🇯🇴",
  // Group K
  Portugal: "🇵🇹",
  "DR Congo": "🇨🇩",
  Uzbekistan: "🇺🇿",
  Colombia: "🇨🇴",
  // Group L
  England: "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
  Croatia: "🇭🇷",
  Ghana: "🇬🇭",
  Panama: "🇵🇦",
};
