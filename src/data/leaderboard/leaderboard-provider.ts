import { Observable } from "rxjs";
import { LeaderboardEntry } from "./leaderboard";

export interface LeaderboardProvider {
  listLeaderboard(
    limit: number,
    orderBy: "score" | "time" | "date",
    order: "asc" | "desc",
    period: "day" | "month" | "year" | "alltime"
  ): Promise<Observable<Array<LeaderboardEntry>>>;

  createEntry(entry: LeaderboardEntry): Promise<void>;
}
