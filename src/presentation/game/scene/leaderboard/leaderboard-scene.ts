import { Context } from "../../../context";
import { PixiScene } from "../pixi-scene";
import { PixiSceneManager } from "../pixi-scene-manager";
import * as PIXI from "pixi.js";

export class LeaderboardScene extends PixiScene {
  constructor(context: Context, manager: PixiSceneManager) {
    super(manager);
    this.draw(context);
  }

  draw(context: Context) {
    const logoTexture = context.pixiAssetLoader.getResource("logo");
    const sprite = new PIXI.Sprite(logoTexture.texture);
    sprite.position.set(context.appSize.x * .5, context.appSize.x * .5 - 100);
    sprite.anchor.set(.5, .5);
    const whRatio = sprite.height / sprite.width;
    sprite.width = context.appSize.x * .7;
    sprite.height = sprite.width * whRatio;
    this.container.addChild(sprite);
  }
}
