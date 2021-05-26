import { Observable } from "rxjs";
import { LeaderboardEntry } from "./leaderboard";
import { LeaderboardProvider } from "./leaderboard-provider";

export class LeaderboardRepository {
  provider: LeaderboardProvider;

  constructor(provider: LeaderboardProvider) {
    this.provider = provider;
  }

  public async listLeaderboard(
    startAt: any | null,
    limit: number,
    orderBy: any,
    order: string
  ): Promise<Observable<Array<LeaderboardEntry>>> {
    return this.provider.listLeaderboard(startAt, limit, orderBy, order);
  }

  createEntry(entry: LeaderboardEntry): Promise<void>{
    return this.provider.createEntry(entry);
  };
}
