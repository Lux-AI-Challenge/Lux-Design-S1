import { Unit } from '../Unit';
import { Cell } from '../GameMap/cell';
import { genID } from '../utils';
import { LuxMatchConfigs } from '../types';
import { Game } from '.';
import { MatchWarn } from 'dimensions-ai';
import { Actionable } from '../Actionable';

/**
 * A city is composed of adjacent city tiles of the same team
 */
export class City {
  static globalIdCount = 0;
  /**
   * fuel stored in city
   */
  public fuel = 0;
  /**
   * the map cells that compose this city
   */
  public citycells: Array<Cell> = [];
  public id: string;

  constructor(
    public team: Unit.TEAM,
    public configs: Readonly<LuxMatchConfigs>
  ) {
    this.id = 'c_' + City.globalIdCount;
    City.globalIdCount++;
  }

  // TODO: Add adjacency bonuses
  getLightUpkeep(): number {
    return this.citycells.length * this.configs.parameters.LIGHT_UPKEEP.CITY;
  }

  addCityTile(cell: Cell): void {
    this.citycells.push(cell);
  }
}

export class CityTile extends Actionable {
  /** the id of the city this tile is a part of */
  public cityid: string;
  /** cooldown for this city tile before it can build or research */
  public cooldown = 0;
  constructor(public team: Unit.TEAM, configs: LuxMatchConfigs) {
    super(configs);
  }

  canBuildUnit(): boolean {
    return this.cooldown === 0;
  }

  canResearch(): boolean {
    return this.cooldown === 0;
  }

  turn(state: Game.State, commands: Array<string>): void {
    if (this.cooldown > 0) {
      this.cooldown--;
    }
    if (commands.length > 1) {
      throw new MatchWarn(
        'Too many commands. City can perform only one action at a time'
      );
    } else if (commands.length === 1) {
      const info = commands[0].split(' ');
      const action = info[0];
      if (action === Game.ACTIONS.BUILD_CART) {
        // TODO
        this.resetCooldown();
      } else if (action === Game.ACTIONS.BUILD_WORKER) {
        // TODO
        this.resetCooldown();
      } else if (action === Game.ACTIONS.RESEARCH) {
        // TODO
        this.resetCooldown();
        state.teamStates[this.team].researchPoints++;
      }
    }
  }

  resetCooldown(): void {
    this.cooldown = this.configs.parameters.CITY_ACTION_COOLDOWN;
  }
}
