import { Unit } from '../Unit';
import { Cell } from '../GameMap/cell';
import { LuxMatchConfigs } from '../types';
import { Game } from '.';
import { MatchWarn } from 'dimensions-ai';
import { Actionable } from '../Actionable';
import { SpawnCartAction, SpawnWorkerAction, ResearchAction } from '../Actions';

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

  turn(game: Game): void {
    if (this.cooldown > 0) {
      this.cooldown--;
    }
    if (this.currentActions.length > 1) {
      throw new MatchWarn(
        'Too many commands. City can perform only one action at a time'
      );
    } else if (this.currentActions.length === 1) {
      const action = this.currentActions[0];
      if (action instanceof SpawnCartAction) {
        // TODO
        this.resetCooldown();
      } else if (action instanceof SpawnWorkerAction) {
        // TODO
        this.resetCooldown();
      } else if (action instanceof ResearchAction) {
        // TODO
        this.resetCooldown();
        game.state.teamStates[this.team].researchPoints++;
      }
    }
  }

  resetCooldown(): void {
    this.cooldown = this.configs.parameters.CITY_ACTION_COOLDOWN;
  }
}
