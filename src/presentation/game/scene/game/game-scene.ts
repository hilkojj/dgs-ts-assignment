import { Context } from "../../../context";
import { PixiScene } from "../pixi-scene";
import { PixiSceneManager } from "../pixi-scene-manager";
import * as PIXI from "pixi.js";
import { PixiAnimatedSprite } from "../../pixi/pixi-animated-sprite";
import { Snake } from "../../../../logic/snake/snake";
import { Vector2 } from "../../../../logic/math/vector2";

const TILE_SIZE = 32

export class GameScene extends PixiScene {

  snake: Snake
  snakeSprites: PIXI.Sprite[] = []
  appleSprite: PIXI.Sprite? = null

  readonly boardTopLeftPosition: Vector2

  constructor(context: Context, manager: PixiSceneManager) {
    super(manager);

    const boardSize = new Vector2(10, 10);

    this.boardTopLeftPosition = context.appSize.getCopy().scale(.5).subtract(boardSize.scale(TILE_SIZE * .5));

    this.createKeyboardListener();

    this.snake = new Snake(boardSize);

    this.snake.on("moved", () => this.draw(context));
    this.snake.on("foodplaced", position => this.drawApple(context, position));
    this.snake.on("gameover", () => console.log("Game over!"));

    this.snake.start();
  }

  createKeyboardListener() {
    document.addEventListener("keydown", event => {

      if (event.code == "ArrowUp")
        this.snake.goUp();
      else if (event.code == "ArrowDown")
        this.snake.goDown();
      else if (event.code == "ArrowLeft")
        this.snake.goLeft();
      else if (event.code == "ArrowRight")
        this.snake.goRight();

    });
  }

  draw(context: Context) {

    console.log("draw");

    this.drawSnake(context);

    // const apeAnimation = context.pixiAssetLoader.getResource("someAnimation");
    
    // const animatedRunner = new PixiAnimatedSprite("Run", apeAnimation);
    // animatedRunner.position.set(context.appSize.x * 0.5, context.appSize.y * 0.6);
    // animatedRunner.anchor.set(0.5, 0.5);
    // animatedRunner.anim.animationSpeed = 0.3;
    // animatedRunner.play();

    // this.container.addChild(animatedRunner.anim);
  }

  drawSnake(context: Context) {

    // remove old snake:
    this.snakeSprites.forEach(sprite => this.container.removeChild(sprite));
    this.snakeSprites = []

    // draw new snake:
    const someImageTexture = context.pixiAssetLoader.getResource("snakePart");

    for (let i = 0; i < this.snake.length; i++) {

      const position = this.snake.getTailPosition(i);

      const sprite = new PIXI.Sprite(someImageTexture.texture);

      const spritePosition = this.boardToCanvasPosition(position);

      sprite.position.set(spritePosition.x, spritePosition.y);
      sprite.anchor.set(0);
      sprite.width = sprite.height = TILE_SIZE;
      this.container.addChild(sprite);
  
      this.snakeSprites.push(sprite);
    }
  }

  drawApple(context: Context, applePosition: Vector2) {

    console.log("Apple position", applePosition);

    if (this.appleSprite)
      this.container.removeChild(this.appleSprite); // todo: animation

    const someImageTexture = context.pixiAssetLoader.getResource("someImage");
    this.appleSprite = new PIXI.Sprite(someImageTexture.texture);

    const spritePosition = this.boardToCanvasPosition(applePosition);

    this.appleSprite.position.set(spritePosition.x, spritePosition.y);
    this.appleSprite.anchor.set(0);
    this.appleSprite.width = this.appleSprite.height = TILE_SIZE;
    this.container.addChild(this.appleSprite);
  }

  boardToCanvasPosition(boardPosition: Vector2): Vector2 {
    return this.boardTopLeftPosition.getCopy().add(boardPosition.getCopy().scale(TILE_SIZE));
  }

  /**
   * Gets called when scene will be destroyed.
   */
  protected async onDestroy(): Promise<void> {
    this.snake.end();
  }
}
