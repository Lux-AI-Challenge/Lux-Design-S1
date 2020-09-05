import { Unit } from '../Unit';
import { Cell } from '../GameMap/cell';
import { genID } from '../utils';
import { LuxMatchConfigs, LuxMatchState } from '../types';
import { Game } from '.';
import { MatchWarn } from 'dimensions-ai';
import { Actionable } from '../Actionable';

/**
 * A city is composed of adjacent city tiles of the same team
 */
export class City extends Actionable {
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

  constructor(public team: Unit.TEAM, configs: LuxMatchConfigs) {
    super(configs);
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

  turn(state: Game.State, commands: Array<string>): void {
    if (this.actionCooldown > 0) {
      this.actionCooldown--;
    }
    if (commands.length > 1) {
      throw new MatchWarn(
        'Too many commands. City can perform only one action at a time'
      );
    } else if (commands.length === 1) {
      const info = commands[0].split(' ');
      const cmd = info[0];
      if (cmd === Game.ACTIONS.BUILD_CART) {
        if (this.canBuildUnit()) {
          // TODO
          this.resetCooldown();
        } else {
          throw new MatchWarn(
            `City ${this.id} is still has cooldown: ${this.actionCooldown} and can't build cart`
          );
        }
      } else if (cmd === Game.ACTIONS.BUILD_WORKER) {
        if (this.canBuildUnit()) {
          // TODO
          this.resetCooldown();
        } else {
          throw new MatchWarn(
            `City ${this.id} is still has cooldown: ${this.actionCooldown} and can't build worker`
          );
        }
      } else if (cmd === Game.ACTIONS.RESEARCH) {
        if (this.canResearch()) {
          this.resetCooldown();
          state.teamStates[this.team].researchPoints++;
        } else {
          throw new MatchWarn(
            `City ${this.id} is still has cooldown: ${this.actionCooldown} and can't research`
          );
        }
      }
    }
  }

  resetCooldown(): void {
    this.actionCooldown = this.configs.parameters.CITY_ACTION_COOLDOWN;
  }
}

export class CityTile {
  /** the id of the city this tile is a part of */
  public cityid: string;
  constructor(public team: Unit.TEAM) {}
}
