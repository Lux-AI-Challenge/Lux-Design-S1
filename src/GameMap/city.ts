import { Unit } from '../Unit';
import { Cell } from './cell';

/**
 * A city is composed of adjacent city tiles of the same team
 */
export class City {
  /**
   * the map cells that compose this city
   */
  public citycells: Array<Cell> = [];
  constructor(public id: string, public team: Unit.TEAM) {}

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
