import { Unit } from '../Unit';
import { Cell } from '../GameMap/cell';
import { LuxMatchConfigs } from '../types';
import { Game } from '.';
import { MatchWarn } from 'dimensions-ai';
import { Actionable } from '../Actionable';
import { SpawnCartAction, SpawnWorkerAction, ResearchAction } from '../Actions';
import { DEFAULT_CONFIGS } from '../defaults';

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
    return (
      this.citycells.length * this.configs.parameters.LIGHT_UPKEEP.CITY -
      this.getAdjacencyBonuses()
    );
  }

  getAdjacencyBonuses(): number {
    let bonus = 0;
    this.citycells.forEach((cell) => {
      bonus +=
        cell.citytile.adjacentCityTiles *
        this.configs.parameters.CITY_ADJACENCY_BONUS;
    });
    return bonus;
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

  /** dynamically updated counter for number of friendly adjacent city tiles */
  public adjacentCityTiles = 0;
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
    if (this.currentActions.length > 1) {
      throw new MatchWarn(
        'Too many commands. City can perform only one action at a time'
      );
    } else if (this.currentActions.length === 1) {
      const action = this.currentActions[0];
      if (action instanceof SpawnCartAction) {
        if (game.unitCapReached(this.team)) {
          throw new MatchWarn(`City tried to build cart but unit cap reached`);
        }
        game.spawnCart(action.team, action.x, action.y);
        this.resetCooldown();
      } else if (action instanceof SpawnWorkerAction) {
        if (game.unitCapReached(this.team)) {
          throw new MatchWarn(
            `City tried to build worker but unit cap reached`
          );
        }
        game.spawnWorker(action.team, action.x, action.y);
        this.resetCooldown();
      } else if (action instanceof ResearchAction) {
        this.resetCooldown();
        game.state.teamStates[this.team].researchPoints++;
        if (
          game.state.teamStates[this.team].researchPoints >=
          this.configs.parameters.RESEARCH_REQUIREMENTS.COAL
        ) {
          game.state.teamStates[this.team].researched.coal = true;
        }
        if (
          game.state.teamStates[this.team].researchPoints >=
          this.configs.parameters.RESEARCH_REQUIREMENTS.URANIUM
        ) {
          game.state.teamStates[this.team].researched.uranium = true;
        }
      }
    }
    if (this.cooldown > 0) {
      this.cooldown--;
    }
  }

  resetCooldown(): void {
    this.cooldown = this.configs.parameters.CITY_ACTION_COOLDOWN;
  }
}
