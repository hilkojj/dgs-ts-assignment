import { Vector2 } from "../math/vector2";
import { EventEmitter } from 'events';

/**
 * This is the class with all Game logic.
 * 
 * It is not responsible for graphics or sound effects nor uploading to the leaderboard,
 * that happens in game-scene.ts
 * 
 * Simply call .start() to start the game, and call .goLeft(), goUp(), etc. to move.
 */
export class Snake extends EventEmitter {

  private boardSize: Vector2;

  private tailPositions: Vector2[];

  private foodPosition: Vector2 = new Vector2();

  private direction: Vector2 = Vector2.RIGHT;
  private lastMoveDirection: Vector2 = Vector2.RIGHT;
  private queuedDirections: Vector2[] = [];

  private gameFinsihed: boolean = false;
  private _won: boolean = false;
  private timeStarted: number = 0;
  private timeEnded: number = 0;

  private updateInterval: any;

  constructor(boardSize: Vector2) {
    super();

    if (boardSize.x < 4 || boardSize.y < 4)
      throw Error("boardSize is too small.");

    this.boardSize = boardSize;

    const center = this.boardSize.scale(.5).floor();

    this.tailPositions = [
      center, center.addXY(1, 0)
    ];
  }

  public get headPosition(): Vector2 {
    return this.tailPositions[this.tailPositions.length - 1].getCopy();
  }

  /**
   * The length of the snake
   */
  public get length(): number {
    return this.tailPositions.length;
  }

  /**
   * Your score (number of apples eaten)
   */
  public get score(): number {
    return this.length - 2; // the game starts with 2 "snake blocks", you don't get a score points for those.
  }

  public get won(): boolean {
    return this._won;
  }

  public get time(): number {
    if (this.gameFinsihed)
      return this.timeEnded - this.timeStarted;
    else return Date.now() - this.timeStarted;
  }

  public get currentDirection(): Vector2 {
    return this.direction.getCopy();
  }

  public getTailPosition(index: number): Vector2 {
    if (index < 0 || index >= this.tailPositions.length)
      throw Error(`index (${index}) is out of range. Length = ${this.tailPositions.length}`);

    return this.tailPositions[index].getCopy();
  }

  public goLeft() {
    this.queuedDirections.push(Vector2.LEFT);
  }

  public goRight() {
    this.queuedDirections.push(Vector2.RIGHT);
  }

  public goUp() {
    this.queuedDirections.push(Vector2.DOWN);
  }

  public goDown() {
    this.queuedDirections.push(Vector2.UP);
  }

  public start() {
    this.timeStarted = Date.now();
    this.placeFood();
    this.updateInterval = setInterval(() => this.update(), 200);
  }

  public end() {
    this.timeEnded = Date.now();
    clearTimeout(this.updateInterval);
  }

  private update() {

    if (this.gameFinsihed)
      throw Error("Snake game is already finished. Do not call update()");

    this.setDirection(this.queuedDirections.shift() || this.direction);

    const newHeadPosition = this.constrainInBoard(
      this.headPosition.add(this.direction)
    );

    if (this.isTail(newHeadPosition)) {
      // game over!
      this.gameFinsihed = true;
      this.end();
      this.emit("gameover", this.score);
      return;
    }

    let foodEaten = false;
    if (newHeadPosition.equalsWithMargin(this.foodPosition, .1)) {
      // food was eaten
      foodEaten = true;
      if (!this.placeFood()) {
        this._won = true;
        this.gameFinsihed = true;
        this.end();
        this.emit("win", this.score);
      }
    }
    // else remove oldest tailPosition:
    else this.tailPositions.shift();

    this.tailPositions.push(newHeadPosition);
    this.lastMoveDirection = this.direction;
    this.emit("moved");
    if (foodEaten)
      this.emit("scoreupdated", this.score);
  }

  private placeFood(): boolean {

    const openTiles = this.getOpenTiles();

    // check if there's room for an apple:
    if (openTiles.length == 0)
      return false;

    this.foodPosition = openTiles[Math.floor(Math.random() * openTiles.length)];

    this.emit("foodplaced", this.foodPosition);
    return true;
  }

  private setDirection(dir: Vector2) {

    if (dir.scale(-1).equalsWithMargin(this.lastMoveDirection, .1))
      return;

    this.direction = dir;
  }

  private constrainInBoard(position: Vector2): Vector2 {
    let newPosition = position.getCopy();
    newPosition.x = newPosition.x % this.boardSize.x;
    newPosition.y = newPosition.y % this.boardSize.y;

    if (newPosition.x < 0)
      newPosition.x = this.boardSize.x + newPosition.x;

    if (newPosition.y < 0)
      newPosition.y = this.boardSize.y + newPosition.y;

    return newPosition.round();
  }

  private isTail(position: Vector2): boolean {
    return this.tailPositions.some(tailPos => tailPos.equalsWithMargin(position, .1));
  }

  private getOpenTiles(): Vector2[] {
    const openTiles: Vector2[] = []

    for (let x = 0; x < this.boardSize.x; x++) {
      for (let y = 0; y < this.boardSize.y; y++) {

        const pos = new Vector2(x, y);

        if (!this.isTail(pos))
          openTiles.push(pos);
      }
    }
    return openTiles;
  }

}
