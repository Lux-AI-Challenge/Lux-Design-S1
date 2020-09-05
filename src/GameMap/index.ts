import { Cell } from './cell';
import 'colors';
import { Resource } from '../Resource';
import { Unit } from '../Unit';
import { genID } from '../utils';
import { City } from './city';

export class GameMap {
  /**
   * The actual map
   */
  public map: Array<Array<Cell>>;

  /**
   * Map a internal city id to the array of cells that are city tiles part of the same city
   */
  public cities: Map<string, City>;

  /**
   * Constructor to initialize empty game map with empty cells
   * @param width - width of map
   * @param height - height of map
   */
  constructor(public width: number, public height: number) {
    this.map = new Array(height);
    for (let y = 0; y < height; y++) {
      this.map[y] = new Array(width);
      for (let x = 0; x < width; x++) {
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

  /**
   * Spawn city tile for a team at (x, y)
   */
  spawnCityTile(team: Unit.TEAM, x: number, y: number): void {
    const cell = this.getCell(x, y);
    cell.setCityTile(team);
    // now update the cities field accordingly
    const adjCells = this.getAdjacentCells(cell);

    const adjSameTeamCityTiles = adjCells.filter((cell) => {
      return cell.isCityTile() && cell.citytile.team === team;
    });

    // if no adjacent city cells of same team, generate new city
    if (adjSameTeamCityTiles.length === 0) {
      const cityid = genID();
      cell.citytile.cityid = cityid;
      this.cities.set(cityid, new City(cityid, team));
    }
    // otherwise add tile to city
    else {
      const cityid = adjSameTeamCityTiles[0].citytile.cityid;
      const city = this.cities.get(cityid);
      city.addCityTile(cell);
    }
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
export namespace GameMap {
  export interface Configs {
    width: number;
    height: number;
  }
}
