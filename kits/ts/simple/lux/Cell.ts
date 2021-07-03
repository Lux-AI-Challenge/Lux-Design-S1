import {Position} from "./Position";
import {CityTile} from "./CityTile";

export interface Resource {
  type: string;
  amount: number;
}

export class Cell {
  public pos: Position;
  public resource: Resource;
  public citytile: CityTile;
  public cooldown: number;

  public constructor(x: number, y: number) {
    this.pos = new Position(x, y);
    this.resource = null;
    this.citytile = null;
    this.cooldown = 0;
  }

  public hasResource(): boolean {
    return this.resource !== null && this.resource.amount > 0;
  }
}
