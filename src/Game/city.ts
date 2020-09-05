import { Unit } from '../Unit';
import { Cell } from '../GameMap/cell';
import { genID } from '../utils';

/**
 * A city is composed of adjacent city tiles of the same team
 */
export class City {
  /**
   * fuel stored in city
   */
  public fuel = 0;
  /**
   * the map cells that compose this city
   */
  public citycells: Array<Cell> = [];
  public id: string;
  constructor(public team: Unit.TEAM) {
    this.id = 'city_' + genID();
  }

  // TODO
  getLightUpkeep(): number {
    return 0;
  }

  addCityTile(cell: Cell): void {
    this.citycells.push(cell);
  }
}

export class CityTile {
  /** the id of the city this tile is a part of */
  public cityid: string;
  constructor(public team: Unit.TEAM) {}
}
