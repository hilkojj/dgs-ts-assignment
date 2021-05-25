import { Vector2 } from "../math/vector2";
import { EventEmitter } from 'events';

export class Snake extends EventEmitter {

  boardSize: Vector2;

  tailPositions: Vector2[];

  foodPosition: Vector2 = new Vector2();

  direction: Vector2 = Vector2.RIGHT;
  lastMoveDirection: Vector2 = Vector2.RIGHT;

  gameFinsihed: boolean = false;

  updateInterval: any

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

  public get length(): number {
    return this.tailPositions.length;
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
    this.setDirection(Vector2.LEFT);
  }

  public goRight() {
    this.setDirection(Vector2.RIGHT);
  }

  public goUp() {
    this.setDirection(Vector2.DOWN);
  }

  public goDown() {
    this.setDirection(Vector2.UP);
  }

  public start() {
    this.placeFood();
    this.updateInterval = setInterval(() => this.update(), 200);
  }

  public end() {
    clearTimeout(this.updateInterval);
  }

  update() {

    if (this.gameFinsihed)
      throw Error("Snake game is already finished. Do not call update()");

    const newHeadPosition = this.constrainInBoard(
      this.headPosition.add(this.direction)
    );

    if (this.isTail(newHeadPosition)) {
      // game over!
      this.gameFinsihed = true;
      this.end();
      this.emit("gameover");
      return;
    }

    if (newHeadPosition.equals(this.foodPosition)) {
      // food was eaten
      this.placeFood();
    }
    // else remove oldest tailPosition:
    else this.tailPositions.shift();

    this.tailPositions.push(newHeadPosition);
    this.lastMoveDirection = this.direction;
    this.emit("moved");
  }

  placeFood() {

    const openTiles = this.getOpenTiles();

    // check if there's room for an apple:
    if (openTiles.length == 0) {

      // TODO: winning condition reached?

      return;
    }

    this.foodPosition = openTiles[Math.floor(Math.random() * openTiles.length)];

    this.emit("foodplaced", this.foodPosition);
  }

  setDirection(dir: Vector2) {

    if (dir.scale(-1).equalsWithMargin(this.lastMoveDirection, .1))
      return;

    this.direction = dir;
  }

  constrainInBoard(position: Vector2): Vector2 {
    let newPosition = position.getCopy();
    newPosition.x = newPosition.x % this.boardSize.x;
    newPosition.y = newPosition.y % this.boardSize.y;

    if (newPosition.x < 0)
      newPosition.x = this.boardSize.x + newPosition.x;

    if (newPosition.y < 0)
      newPosition.y = this.boardSize.y + newPosition.y;

    return newPosition.round();
  }

  isTail(position: Vector2): boolean {
    return this.tailPositions.some(tailPos => tailPos.equals(position));
  }

  getOpenTiles(): Vector2[] {
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