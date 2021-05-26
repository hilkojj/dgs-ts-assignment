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
  appleSprite: PixiAnimatedSprite? = null
  scoreText: PIXI.Text? = null

  readonly context: Context
  readonly boardTopLeftPosition: Vector2

  constructor(context: Context, manager: PixiSceneManager) {
    super(manager);
    this.context = context;

    const boardSize = new Vector2(14, 14);

    this.boardTopLeftPosition = context.appSize.getCopy().scale(.5).subtract(boardSize.scale(TILE_SIZE * .5));

    this.createKeyboardListener();
    this.container.sortableChildren = true;
    this.drawBackground(boardSize);
    this.drawHUD();

    this.snake = new Snake(boardSize);

    this.snake.on("moved", () => this.drawSnake());
    this.snake.on("foodplaced", position => this.drawApple(position));
    this.snake.on("gameover", () => {
      console.log("Game over!")
      context.audioManager.playSound("gameOver");
      this.stopMusic();
    });
    this.snake.on("scoreupdated", score => {
      if (this.scoreText)
        this.scoreText.text = score.toString();

      context.audioManager.playSound("eat");
    });

    this.snake.start();
    this.startMusic();
  }

  createKeyboardListener() {
    document.addEventListener("keydown", event => {

      let playSound = true;

      if (event.code == "ArrowUp")
        this.snake.goUp();
      else if (event.code == "ArrowDown")
        this.snake.goDown();
      else if (event.code == "ArrowLeft")
        this.snake.goLeft();
      else if (event.code == "ArrowRight")
        this.snake.goRight();
      else playSound = false;

      if (playSound)
        this.context.audioManager.playSound("changeDirection");

    });
  }

  drawBackground(boardSize: Vector2) {
    const graphics = new PIXI.Graphics();

    const borderWidth = 8;
    graphics.beginFill(new Color(50, 0, 100, 255).hexCode);
    graphics.drawRoundedRect(this.boardTopLeftPosition.x - borderWidth,
                             this.boardTopLeftPosition.y - borderWidth,
                             boardSize.x * TILE_SIZE + borderWidth * 2,
                             boardSize.y * TILE_SIZE + borderWidth * 2, 4);

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

  drawSnake() {

    // remove old snake:
    this.snakeSprites.forEach(sprite => this.container.removeChild(sprite));
    this.snakeSprites = []

    // draw new snake:
    const snakePartTexture = this.context.pixiAssetLoader.getResource("snakePart");
    const snakeHeadTexture = this.context.pixiAssetLoader.getResource("snakeHead");

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

  drawApple(applePosition: Vector2) {

    if (this.appleSprite)       // play eating animation of old apple sprite. That sprite will disappear after playing.
      this.appleSprite.play();

    const appleAnimation = this.context.pixiAssetLoader.getResource("appleAnimation");

    const animatedRunner = new PixiAnimatedSprite("apple-anim", appleAnimation);

    const spritePosition = this.boardToCanvasPosition(applePosition);

    animatedRunner.position.set(spritePosition.x, spritePosition.y);
    animatedRunner.anchor.set(0);
    animatedRunner.anim.width = animatedRunner.anim.height = TILE_SIZE;
    animatedRunner.anim.loop = false;
    animatedRunner.anim.animationSpeed = 0.3;
    animatedRunner.anim.zIndex = 100;
    animatedRunner.anim.onComplete = () => {
      this.container.removeChild(animatedRunner.anim);
    };
    this.container.addChild(animatedRunner.anim);

    this.appleSprite = animatedRunner;
  }

  drawHUD() {

    const scorePosition = this.boardTopLeftPosition.getCopy().addXY(0, -32);

    const appleTexture = this.context.pixiAssetLoader.getResource("apple");
    const sprite = new PIXI.Sprite(appleTexture.texture);
    sprite.position.set(scorePosition.x, scorePosition.y);
    sprite.anchor.set(0, .5);
    sprite.width = sprite.height = TILE_SIZE;
    this.container.addChild(sprite);

    let style = new PIXI.TextStyle({
      fontFamily: "arial",
      fontSize: 24,
      fill: "#000000"
    });

    this.scoreText = new PIXI.Text("0", style);
    this.scoreText.anchor.set(0, 0.4);
    this.scoreText.position.set(scorePosition.x + 38, scorePosition.y);
    this.container.addChild(this.scoreText);
  }

  boardToCanvasPosition(boardPosition: Vector2): Vector2 {
    return this.boardTopLeftPosition.getCopy().add(boardPosition.getCopy().scale(TILE_SIZE));
  }

  startMusic() {
    this.context.audioManager.playSound("music");
    this.context.audioManager.loopSound("music");
  }

  stopMusic() {
    this.context.audioManager.stopSound("music");
  }

  /**
   * Gets called when scene will be destroyed.
   */
  protected async onDestroy(): Promise<void> {
    this.snake.end();
    this.stopMusic();
  }
}
