import {GAME_CONSTANTS} from "./game_constants";
const {DIRECTIONS} = GAME_CONSTANTS;

export type ArrayPosition = [x: number, y: number];

export class Position {
  public x: number;
  public y: number;

  public constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  public isAdjacent(pos: Position): boolean {
    const dx = this.x - pos.x;
    const dy = this.y - pos.y;
    return Math.abs(dx) + Math.abs(dy) <= 1;
  }

  public equals(pos: Position): boolean {
    return this.x === pos.x && this.y === pos.y;
  }

  public translate(direction: string, units: number): Position {
    switch (direction) {
      case DIRECTIONS.NORTH:
        return new Position(this.x, this.y - units);
      case DIRECTIONS.EAST:
        return new Position(this.x + units, this.y);
      case DIRECTIONS.SOUTH:
        return new Position(this.x, this.y + units);
      case DIRECTIONS.WEST:
        return new Position(this.x - units, this.y);
      case DIRECTIONS.CENTER:
        return new Position(this.x, this.y);
    }
  }

  /** Returns distance to pos from this position */
  public distanceTo(pos: Position): number {
    const dx = pos.x - this.x;
    const dy = pos.y - this.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  /** Returns closest direction to targetPos, or null if staying put is best */
  public directionTo(targetPos: Position): string {
    const checkDirections = [
      DIRECTIONS.NORTH,
      DIRECTIONS.EAST,
      DIRECTIONS.SOUTH,
      DIRECTIONS.WEST,
    ];
    let closestDirection = DIRECTIONS.CENTER;
    let closestDist = this.distanceTo(targetPos);
    checkDirections.forEach((dir) => {
      const newpos = this.translate(dir, 1);
      const dist = targetPos.distanceTo(newpos);
      if (dist < closestDist) {
        closestDist = dist;
        closestDirection = dir;
      }
    });
    return closestDirection;
  }
}