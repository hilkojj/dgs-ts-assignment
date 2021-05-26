import { AuthRepository } from "../data/auth/auth-repository";
import { AuthState } from "../logic/state/auth-state";
import { Vector2 } from "../logic/math/vector2";
import { LeaderboardRepository } from "../data/leaderboard/leaderboard-repository";
import { AudioManager } from "./game/audio/audio-manager";
import { AssetRepository } from "../data/loading/asset-repository";
import { LoaderResource } from "pixi.js";
import { Howl } from "howler";
import { Snake } from "../logic/snake/snake";

export class Context {
  appSize: Vector2;
  authRepository: AuthRepository;
  authState: AuthState;
  leaderboardRepo: LeaderboardRepository;
  pixiAssetLoader: AssetRepository<LoaderResource>;
  howlerAssetLoader: AssetRepository<Howl>;
  audioManager: AudioManager;
  lastSnakeGame?: Snake;

  constructor(
    appSize: Vector2,
    authRepository: AuthRepository,
    authState: AuthState,
    leaderboardRepo: LeaderboardRepository,
    pixiAssetRepo: AssetRepository<LoaderResource>,
    howlerAssetLoader: AssetRepository<Howl>,
    audioManager: AudioManager
  ) {
    this.appSize = appSize;
    this.authRepository = authRepository;
    this.authState = authState;
    this.leaderboardRepo = leaderboardRepo;
    this.pixiAssetLoader = pixiAssetRepo;
    this.howlerAssetLoader = howlerAssetLoader;
    this.audioManager = audioManager;
  }
}
