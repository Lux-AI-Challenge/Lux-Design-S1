import { Game } from '../Game';

export class Position {
  public static fromString(string: String): Position {
    return Position.fromArray(string.split(",").map(str => parseInt(str)));
  }
  public static fromArray(arr: number[]): Position {
    return new Position(arr[0], arr[1]);
  }
  constructor(public x: number, public y: number) {}
  isAdjacent(pos: Position): boolean {
    const dx = this.x - pos.x;
    const dy = this.y - pos.y;
    if (Math.abs(dx) + Math.abs(dy) > 1) {
      return false;
    }
    return true;
  }
  translate(direction: Game.DIRECTIONS, units: number = 1): Position {
    switch (direction) {
      case Game.DIRECTIONS.NORTH:
        return new Position(this.x, this.y - units);
      case Game.DIRECTIONS.EAST:
        return new Position(this.x + units, this.y);
      case Game.DIRECTIONS.SOUTH:
        return new Position(this.x, this.y + units);
      case Game.DIRECTIONS.WEST:
        return new Position(this.x - units, this.y);
      case Game.DIRECTIONS.CENTER:
        return new Position(this.x, this.y);
    }
  }
  equals(other: Position): boolean {
    return this.x == other.x && this.y == other.y;
  }
  toString(): string {
    return `${this.x},${this.y}`
  }
}
