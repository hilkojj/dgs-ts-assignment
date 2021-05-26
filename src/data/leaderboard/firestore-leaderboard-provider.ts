import firebase from "firebase/app";
import "firebase/firestore";
import { LeaderboardProvider } from "./leaderboard-provider";
import { Observable } from "rxjs";
import { LeaderboardEntry } from "./leaderboard";

export class FirestoreLeaderboardProvider implements LeaderboardProvider {
  private firestore: firebase.firestore.Firestore;
  private collectionReference: firebase.firestore.CollectionReference<firebase.firestore.DocumentData>;

  constructor() {
    this.firestore = firebase.firestore();
    this.collectionReference = this.firestore.collection("leaderboard");
  }

  async listLeaderboard(
    startAt: any | null,
    limit: number,
    orderBy: "score" | "time" | "date",
    order: "asc" | "desc"
  ): Promise<Observable<Array<LeaderboardEntry>>> {

    return new Observable<Array<LeaderboardEntry>>(observer => {

      let query = this.collectionReference
        .orderBy(orderBy, order)
        .limit(limit);

      if (startAt)
        query = query.startAt(startAt);

      query.onSnapshot(snap => {

        observer.next(
          snap.docs.map(docSnap => { return {
            name:
              ("" + docSnap.data()["name"])
              .substr(0, 12)                                // max length of 12
              .replace(/(\r\n|\n|\r)/gm, "")                // remove newlines
              .replace(/<[^>]*>?/gm, ''),                   // remove HTML tags
                                                            // note, this should probably happen in a presentation class, not in a data class like a LeaderboardProvider.

            time: Math.max(0, docSnap.data()["time"]),

            date: new Date(docSnap.data()["date"].timestamp),

            score: Math.max(0, docSnap.data()["score"])
          }})
        );
      });
    });
  }

  async createEntry(entry: LeaderboardEntry): Promise<void> {
    await this.collectionReference.add(entry);
  }
}
