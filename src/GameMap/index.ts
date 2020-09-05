import { Cell } from '../Game/cell';
import { Unit } from '../Unit';
import { Resource } from '../Resource';

export class GameMap {
  /**
   * The actual map
   */
  private map: Array<Array<Cell>>;
  /**
   * Constructor to initialize empty game map with empty cells
   * @param width - width of map
   * @param height - height of map
   */
  constructor(public width: number, public height: number) {
    this.map = new Array(this.height);
    for (let y = 0; y < this.height; y++) {
      this.map[y] = new Array(this.width);
      for (let x = 0; x < this.width; x++) {
        this.map[y][x] = new Cell(x, y);
      }
    }
  }

  getCell(x: number, y: number): Cell {
    return this.map[y][x];
  }
  getRow(y: number): Array<Cell> {
    return this.map[y];
  }

  getAdjacentCells(cell: Cell): Array<Cell> {
    const cells: Array<Cell> = [];
    if (cell.x > 0) {
      cells.push(this.getCell(cell.x - 1, cell.y));
    }
    if (cell.y > 0) {
      cells.push(this.getCell(cell.x, cell.y - 1));
    }
    if (cell.x < this.width - 1) {
      cells.push(this.getCell(cell.x + 1, cell.y));
    }
    if (cell.x < this.height - 1) {
      cells.push(this.getCell(cell.x, cell.y + 1));
    }
    return cells;
  }

  /**
   * Return printable map string
   */
  getMapString(): string {
    let str = '';
    for (let y = 0; y < this.height; y++) {
      str +=
        this.getRow(y)
          .map((cell) => {
            if (cell.hasUnits()) {
              if (cell.units.size === 1) {
                let unitstr = '';
                cell.units.forEach((unit) => {
                  let identifier = 'w';
                  if (unit.type === Unit.Type.CART) {
                    identifier = 'c';
                  }
                  if (unit.team === Unit.TEAM.A) {
                    unitstr = identifier.cyan;
                  } else {
                    unitstr = identifier.red;
                  }
                });
                return unitstr;
              }
            } else if (cell.hasResource()) {
              switch (cell.resource.type) {
                case Resource.Types.WOOD:
                  return `▩`.yellow;
                case Resource.Types.COAL:
                  return `▩`.gray;
                case Resource.Types.URANIUM:
                  return `▩`.magenta;
              }
            } else if (cell.isCityTile()) {
              if (cell.citytile.team === Unit.TEAM.A) {
                return `▩`.cyan;
              } else {
                return `▩`.red;
              }
            }
            return '0';
          })
          .join(' ') + '\n';
    }
    return str;
  }
}
export namespace GameMap {}
