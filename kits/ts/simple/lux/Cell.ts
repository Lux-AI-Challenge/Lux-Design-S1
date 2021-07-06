import {Position} from "./Position";
import {CityTile} from "./CityTile";

export interface Resource {
  type: string;
  amount: number;
}

export class Cell {
  public pos: Position;
  public resource: Resource = null;
  public citytile: CityTile = null;
  public road = 0;

  public constructor(x: number, y: number) {
    this.pos = new Position(x, y);
  }

  public hasResource(): boolean {
    return this.resource !== null && this.resource.amount > 0;
  }
}
