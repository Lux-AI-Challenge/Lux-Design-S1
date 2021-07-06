import GAME_CONSTANTS from "./game_constants.json";
import {Position} from "./Position";
import {GameMap} from "./GameMap";

export interface Cargo {
  wood: number;
  coal: number;
  uranium: number;
}

export class Unit {
  public team: number;
  public type: number;
  public id: string;
  public pos: Position;
  public cooldown: number;
  public cargo: Cargo;

  public constructor(
    teamid: number, type: number, unitid: string,
    x: number, y: number, cooldown: number,
    wood: number, coal: number, uranium: number,
  ) {
    this.pos = new Position(x, y);
    this.team = teamid;
    this.id = unitid;
    this.type = type;
    this.cooldown = cooldown;
    this.cargo = {
      wood,
      coal,
      uranium
    }
  }

  public isWorker(): boolean {
    return this.type === GAME_CONSTANTS.UNIT_TYPES.WORKER;
  }

  public isCart(): boolean {
    return this.type === GAME_CONSTANTS.UNIT_TYPES.CART;
  }

  public getCargoSpaceLeft(): number {
    const spaceused = this.cargo.wood + this.cargo.coal + this.cargo.uranium;
    if (this.type === GAME_CONSTANTS.UNIT_TYPES.WORKER) {
      return GAME_CONSTANTS.PARAMETERS.RESOURCE_CAPACITY.WORKER - spaceused;
    } else {
      return GAME_CONSTANTS.PARAMETERS.RESOURCE_CAPACITY.CART - spaceused;
    }
  }

  /** whether or not the unit can build where it is right now */
  public canBuild(gameMap: GameMap): boolean {
    const cell = gameMap.getCellByPos(this.pos);
    return !cell.hasResource() && this.canAct() && this.cargo.wood >= GAME_CONSTANTS.PARAMETERS.CITY_WOOD_COST;
  }

  /** whether or not the unit can act or not. This does not check for potential collisions into other units or enemy cities */
  public canAct(): boolean {
    return this.cooldown < 1;
  }

  /** return the command to move unit in the given direction */
  public move(dir: string): string {
    return `m ${this.id} ${dir}`;
  }

  /** return the command to transfer a resource from a source unit to a destination unit as specified by their ids or the units themselves */
  public transfer(destUnitId: string, resourceType: string, amount: number): string {
    return `t ${this.id} ${destUnitId} ${resourceType} ${amount}`;
  }

  /** return the command to build a city right under the worker */
  public buildCity(): string {
    return `bcity ${this.id}`;
  }

  /** return the command to pillage whatever is underneath the worker */
  public pillage(): string {
    return `p ${this.id}`;
  }
}
