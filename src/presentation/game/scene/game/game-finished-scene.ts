import { Color } from "../../../../logic/rendering/color";
import { Context } from "../../../context";
import { PixiScene } from "../pixi-scene";
import { PixiSceneManager } from "../pixi-scene-manager";
import * as PIXI from "pixi.js";

export class GameFinishedScene extends PixiScene {

  readonly context: Context
  keyboardListener: any

  constructor(context: Context, manager: PixiSceneManager) {
    super(manager);
    this.context = context;

    this.draw();
    this.createKeyboardListener();
  }

  createKeyboardListener() {

    this.keyboardListener = event => {

      // Retry:
      if (event.code == "KeyR")
        this.manager.goTo(2);

      // Leaderboard:
      else if (event.code == "KeyL")
        this.manager.goTo(4);

    };
    document.addEventListener("keydown", this.keyboardListener);
  }

  draw() {

    const logoTexture = this.context.pixiAssetLoader.getResource("logo");
    const sprite = new PIXI.Sprite(logoTexture.texture);
    sprite.position.set(this.context.appSize.x * .5, this.context.appSize.x * .5 - 100);
    sprite.anchor.set(.5, .5);
    const whRatio = sprite.height / sprite.width;
    sprite.width = this.context.appSize.x * .7;
    sprite.height = sprite.width * whRatio;
    this.container.addChild(sprite);

    {
      const text = new PIXI.Text(
        this.context.lastSnakeGame?._won ? "You won the game!" : "Game over!",
        {fontSize: 42, fill: Color.white().hexCode}
      );
      text.anchor.set(0.5, 0.5);
      text.position.set(this.context.appSize.x * 0.5, this.context.appSize.y * 0.5)
      this.container.addChild(text);
    }
    {
      const text = new PIXI.Text(
        "Score: " + (this.context.lastSnakeGame?.score.toString() || "0"),
        {fontSize: 24, fill: Color.white().hexCode}
      );
      text.anchor.set(0.5, 0);
      text.position.set(this.context.appSize.x * 0.5, this.context.appSize.y * 0.5 + 40)
      this.container.addChild(text);
    }
    {
      const text = new PIXI.Text(
        "Press R to retry\nPress L to show the Leaderboard",
        {fontSize: 16, fill: Color.white().hexCode}
      );
      text.anchor.set(0.5, 0);
      text.position.set(this.context.appSize.x * 0.5, this.context.appSize.y * 0.5 + 100)
      this.container.addChild(text);
    }
  }

  /**
   * Gets called when scene will be destroyed.
   */
   protected async onDestroy(): Promise<void> {
    document.removeEventListener("keydown", this.keyboardListener);
  }

}
