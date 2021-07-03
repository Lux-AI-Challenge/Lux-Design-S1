import {Cell} from "./Cell";
import {Position} from "./Position";

export class GameMap {
  public width: number;
  public height: number;
  public map: Array<Array<Cell>>;

  public constructor(width: number, height: number) {
    this.height = height;
    this.width = width;
    this.map = new Array(this.height);

    for (let y = 0; y < this.height; y++) {
      this.map[y] = new Array(this.width);
      for (let x = 0; x < this.width; x++) {
        this.map[y][x] = new Cell(x, y);
      }
    }
  }

  public getCellByPos(pos: Position): Cell {
    return this.map[pos.y][pos.x];
  }

  public getCell(x: number, y: number): Cell {
    return this.map[y][x];
  }

  public _setResource(type: string, x: number, y: number, amount: number): void {
    const cell = this.getCell(x, y);
    cell.resource = {
      type, amount
    };
  }
}
