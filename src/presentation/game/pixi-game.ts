import * as PIXI from "pixi.js";
import { Context } from "../context";
import { LeaderboardScene } from "./scene/leaderboard/leaderboard-scene";
import { GameScene } from "./scene/game/game-scene";
import { PixiSceneManager } from "./scene/pixi-scene-manager";
import { AuthScene } from "./scene/auth/auth-scene";
import { SplashScene } from "./scene/splash/splash-scene";
import { Color } from "../../logic/rendering/color";
import { GameFinishedScene } from "./scene/game/game-finished-scene";

export class PixiGame {
  private sceneManager: PixiSceneManager;
  private app: PIXI.Application;

  constructor(context: Context) {
    this.app = new PIXI.Application({
      width: context.appSize.x,
      height: context.appSize.y,
      resolution: window.devicePixelRatio || 1,
      backgroundColor: Color.blue().hexCode,
      autoDensity: true,
    });

    this.app.renderer.resize(context.appSize.x, context.appSize.y);

    document.body.appendChild(this.app.view);

    this.sceneManager = new PixiSceneManager(
      this.app.stage,
      [
        (manager: PixiSceneManager) => new SplashScene(context, manager),
        (manager: PixiSceneManager) => new AuthScene(context, manager),
        (manager: PixiSceneManager) => new GameScene(context, manager),
        (manager: PixiSceneManager) => new GameFinishedScene(context, manager),
        (manager: PixiSceneManager) => new LeaderboardScene(context, manager),
      ],
      3
    );
  }
}
