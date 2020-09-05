import { Unit } from '../Unit';
import { Cell } from '../GameMap/cell';
import { genID } from '../utils';
import { LuxMatchConfigs } from '../types';

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
  constructor(public team: Unit.TEAM, public configs: LuxMatchConfigs) {
    this.id = 'city_' + genID();
  }

  // TODO
  getLightUpkeep(): number {
    return;
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
