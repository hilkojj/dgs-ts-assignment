import { AuthState } from "../logic/state/auth-state";
import { AuthRepository } from "../data/auth/auth-repository";
import { FirebaseAuthProvider } from "../data/auth/firebase-auth-provider";
import { PixiGame } from "./game/pixi-game";
import { LeaderboardRepository } from "../data/leaderboard/leaderboard-repository";
import { FirestoreLeaderboardProvider } from "../data/leaderboard/firestore-leaderboard-provider";
import { Context } from "./context";
import { Vector2 } from "../logic/math/vector2";
import { AudioManager } from "./game/audio/audio-manager";
import { AssetRepository } from "../data/loading/asset-repository";
import { PixiAssetProvider } from "../data/loading/pixi-asset-provider";
import { HowlerAssetProvider } from "../data/loading/howler-asset-provider";

export class App {
  private game: PixiGame;

  constructor() {
    const authState = new AuthState();
    const authRepository = new AuthRepository(new FirebaseAuthProvider());
    const leaderboardRepository = new LeaderboardRepository(new FirestoreLeaderboardProvider());

    const pixiAssetPaths = new Map<string, string>(
      Object.entries({
        snakePart: "./assets/images/snake-part.png",
        snakeHead: "./assets/images/snake-head.png",
        apple: "./assets/images/apple.png",
        appleAnimation: "./assets/animations/apple-animation.json"
      })
    );
    const pixiAssetLoader = new AssetRepository(new PixiAssetProvider(pixiAssetPaths));

    const howlerAssetPaths = new Map<string, string>(
      Object.entries({
        someSound: "./assets/sounds/some-sound.wav",
      })
    );
    const howlerAssetLoader = new AssetRepository(new HowlerAssetProvider(howlerAssetPaths));
    const audioManager = new AudioManager();

    const context = new Context(
      new Vector2(window.innerHeight * 0.5625, window.innerHeight),
      authRepository,
      authState,
      leaderboardRepository,
      pixiAssetLoader,
      howlerAssetLoader,
      audioManager
    );
    this.game = new PixiGame(context);
  }
}
