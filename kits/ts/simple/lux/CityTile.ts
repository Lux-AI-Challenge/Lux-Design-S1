/** CityTile and Unit are both actionable and can return action strings to send to engine  */
import {Position} from "./Position";

export class CityTile {
  public team: number;
  public cityid: string;
  public pos: Position;
  public cooldown: number;

  public constructor(teamid: number, cityid: string, x: number, y: number, cooldown: number) {
    this.cityid = cityid;
    this.team = teamid;
    this.pos = new Position(x, y);
    this.cooldown = cooldown;
  }

  /** Whether or not this unit can research or build */
  public canAct(): boolean {
    return this.cooldown < 1;
  }

  /** returns command to ask this tile to research this turn */
  public research(): string {
    return `r ${this.pos.x} ${this.pos.y}`;
  }

  /** returns command to ask this tile to build a worker this turn */
  public buildWorker(): string {
    return `bw ${this.pos.x} ${this.pos.y}`;
  }

  /** returns command to ask this tile to build a cart this turn */
  public buildCart(): string {
    return `bc ${this.pos.x} ${this.pos.y}`;
  }
}
