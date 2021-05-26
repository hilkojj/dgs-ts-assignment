import { Observable } from "rxjs";
import { LeaderboardEntry } from "./leaderboard";

export interface LeaderboardProvider {
  listLeaderboard(
    startAt: any | null,
    limit: number,
    orderBy: any,
    order: string
  ): Promise<Observable<Array<LeaderboardEntry>>>;

  createEntry(entry: LeaderboardEntry): Promise<void>;
}
