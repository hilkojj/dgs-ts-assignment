import { Observable } from "rxjs";
import { LeaderboardEntry } from "./leaderboard";
import { LeaderboardProvider } from "./leaderboard-provider";

export class LeaderboardRepository {
  provider: LeaderboardProvider;

  constructor(provider: LeaderboardProvider) {
    this.provider = provider;
  }

  listLeaderboard(
    limit: number,
    orderBy: "score" | "time" | "date",
    order: "asc" | "desc",
    period: "day" | "month" | "year" | "alltime" = "alltime"
  ): Promise<Observable<Array<LeaderboardEntry>>> {
    return this.provider.listLeaderboard(limit, orderBy, order, period);
  }

  createEntry(entry: LeaderboardEntry): Promise<void>{
    return this.provider.createEntry(entry);
  };
}
