import { Observable } from "rxjs";
import { LeaderboardEntry } from "./leaderboard";

export interface LeaderboardProvider {
  listLeaderboard(
    startAt: any | null,
    limit: number,
    orderBy: "score" | "time" | "date",
    order: "asc" | "desc"
  ): Promise<Observable<Array<LeaderboardEntry>>>;

  createEntry(entry: LeaderboardEntry): Promise<void>;
}
