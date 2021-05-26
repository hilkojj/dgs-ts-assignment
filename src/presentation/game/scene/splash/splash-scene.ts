import { Context } from "../../../context";
import { PixiScene } from "../pixi-scene";
import { PixiSceneManager } from "../pixi-scene-manager";
import * as PIXI from "pixi.js";
import { Color } from "../../../../logic/rendering/color";
import { User } from "../../../../data/auth/user";

export class SplashScene extends PixiScene {
  loadText: PIXI.Text;

  constructor(context: Context, manager: PixiSceneManager) {
    super(manager);

    let style = new PIXI.TextStyle({
      fontFamily: "arial",
      fontSize: context.appSize.x * (32 / 545),
      fontWeight: "bold",
      fill: "#ffffff",
      stroke: "#000000",
      strokeThickness: context.appSize.x * (3 / 545),
      wordWrap: true,
      wordWrapWidth: 440,
      lineJoin: "round",
    });

    this.loadText = new PIXI.Text("Loading... 0%", style);
    this.loadText.anchor.set(0.5, 0.5);
    this.loadText.position.set(context.appSize.x * 0.5, context.appSize.y * 0.7);
    this._container.addChild(this.loadText);
    
    this.draw(context);
    this.load(context);
  }

  async load(context: Context) {
    context.pixiAssetLoader.loader.onProgress.add(() => this.progressHandler(context));
    await context.pixiAssetLoader.load();
    await context.audioManager.loadSounds(context.howlerAssetLoader);
    context.authState.observable.subscribe((user) => this.handleAuthStateChange(user));
  }

  draw(context: Context) {
  }

  private progressHandler(context: Context) {
    this.loadText.text = "Loading... " + Math.floor(context.pixiAssetLoader.loader.progress) + "%";
  }

  handleAuthStateChange(user: User | null) {
    !user ? this.manager.goTo(1) : this.manager.goTo(2);
  }
}
