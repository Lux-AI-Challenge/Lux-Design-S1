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

  /** turns before this city is allowed to build or research */
  public actionCooldown = 0;

  constructor(public team: Unit.TEAM, public configs: LuxMatchConfigs) {
    this.id = 'city_' + genID();
  }

  // TODO: Add adjacency bonuses
  getLightUpkeep(): number {
    return this.citycells.length * this.configs.parameters.LIGHT_UPKEEP.CITY;
  }

  addCityTile(cell: Cell): void {
    this.citycells.push(cell);
  }

  canBuildUnit(): boolean {
    return this.actionCooldown === 0;
  }

  canResearch(): boolean {
    return this.actionCooldown === 0;
  }

  /**
   * Process all commands for this city
   */
  turn(commands: Array<string>): void {
    if (this.actionCooldown > 0) {
      this.actionCooldown--;
    }
    if (commands.length > 1) {
      throw Error(
        'Too many commands. City can perform only one action at a time'
      );
    }
  }
}

export class CityTile {
  /** the id of the city this tile is a part of */
  public cityid: string;
  constructor(public team: Unit.TEAM) {}
}
