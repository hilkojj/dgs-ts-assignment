import { Context } from "../../../context";
import { PixiScene } from "../pixi-scene";
import { PixiSceneManager } from "../pixi-scene-manager";
import * as PIXI from "pixi.js";
import { PixiAnimatedSprite } from "../../pixi/pixi-animated-sprite";
import { Snake } from "../../../../logic/snake/snake";
import { Vector2 } from "../../../../logic/math/vector2";
import { Color } from "../../../../logic/rendering/color";

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
    this.drawBackground(context, boardSize);

    this.snake = new Snake(boardSize);

    this.snake.on("moved", () => this.drawSnake(context));
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

  drawBackground(context: Context, boardSize: Vector2) {
    const graphics = new PIXI.Graphics();

    for (let x = 0; x < boardSize.x; x++) {
      for (let y = 0; y < boardSize.y; y++) {

        const color = (x + y) % 2 == 0 ? new Color(0, 220, 100) : new Color(100, 240, 0);

        graphics.beginFill(color.hexCode);
        graphics.drawRect(this.boardTopLeftPosition.x + x * TILE_SIZE,
                          this.boardTopLeftPosition.y + y * TILE_SIZE,
                          TILE_SIZE, TILE_SIZE);
      }
    }
    this.container.addChild(graphics);
  }

  // draw(context: Context) {


    // const apeAnimation = context.pixiAssetLoader.getResource("someAnimation");
    
    // const animatedRunner = new PixiAnimatedSprite("Run", apeAnimation);
    // animatedRunner.position.set(context.appSize.x * 0.5, context.appSize.y * 0.6);
    // animatedRunner.anchor.set(0.5, 0.5);
    // animatedRunner.anim.animationSpeed = 0.3;
    // animatedRunner.play();

    // this.container.addChild(animatedRunner.anim);
  // }

  drawSnake(context: Context) {

    // remove old snake:
    this.snakeSprites.forEach(sprite => this.container.removeChild(sprite));
    this.snakeSprites = []

    // draw new snake:
    const snakePartTexture = context.pixiAssetLoader.getResource("snakePart");
    const snakeHeadTexture = context.pixiAssetLoader.getResource("snakeHead");

    for (let i = 0; i < this.snake.length; i++) {

      const position = this.snake.getTailPosition(i);

      const isHead = i == this.snake.length - 1;
      const texture = isHead ? snakeHeadTexture : snakePartTexture;

      const sprite = new PIXI.Sprite(texture.texture);
      const spritePosition = this.boardToCanvasPosition(position);
      sprite.position.set(spritePosition.x + TILE_SIZE * .5, spritePosition.y + TILE_SIZE * .5);
      sprite.anchor.set(.5);
      sprite.width = sprite.height = TILE_SIZE;

      if (isHead) {
        if (this.snake.currentDirection.equals(Vector2.LEFT))
          sprite.rotation = Math.PI * .5;
        if (this.snake.currentDirection.equals(Vector2.RIGHT))
          sprite.rotation = Math.PI * -.5;
        if (this.snake.currentDirection.equals(Vector2.DOWN))
          sprite.rotation = Math.PI;
      }

      this.container.addChild(sprite);
      this.snakeSprites.push(sprite);
    }
  }

  drawApple(context: Context, applePosition: Vector2) {

    console.log("Apple position", applePosition);

    if (this.appleSprite)
      this.container.removeChild(this.appleSprite); // todo: animation

    const appleTexture = context.pixiAssetLoader.getResource("apple");
    this.appleSprite = new PIXI.Sprite(appleTexture.texture);

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
