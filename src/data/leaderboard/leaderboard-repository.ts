import { Observable } from "rxjs";
import { LeaderboardEntry } from "./leaderboard";
import { LeaderboardProvider } from "./leaderboard-provider";

export class LeaderboardRepository {
  provider: LeaderboardProvider;

  constructor(provider: LeaderboardProvider) {
    this.provider = provider;
  }

  listLeaderboard(
    startAt: any | null,
    limit: number,
    orderBy: "score" | "time" | "date",
    order: "asc" | "desc"
  ): Promise<Observable<Array<LeaderboardEntry>>> {
    return this.provider.listLeaderboard(startAt, limit, orderBy, order);
  }

  createEntry(entry: LeaderboardEntry): Promise<void>{
    return this.provider.createEntry(entry);
  };
}
