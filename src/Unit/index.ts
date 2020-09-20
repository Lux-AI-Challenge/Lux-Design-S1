import { LuxMatchConfigs } from '../types';
import { Game } from '../Game';
import {
  MoveAction,
  TransferAction,
  SpawnCityAction,
  PillageAction,
} from '../Actions';
import { MatchWarn } from 'dimensions-ai';
import { Actionable } from '../Actionable';
import { Resource } from '../Resource';
import { Position } from '../GameMap/position';

export abstract class Unit extends Actionable {
  public id: string;
  static globalIdCount = 0;
  public cooldown = 0;
  public cargo: Unit.Cargo = {
    wood: 0,
    coal: 0,
    uranium: 0,
  };
  public pos: Position;
  constructor(
    x: number,
    y: number,
    public type: Unit.Type,
    public team: Unit.TEAM,
    configs: LuxMatchConfigs
  ) {
    super(configs);
    this.id = 'u_' + Unit.globalIdCount;
    Unit.globalIdCount++;
    this.pos = new Position(x, y);
  }
  public getCargoSpaceLeft(): number {
    let capacity = this.configs.parameters.RESOURCE_CAPACITY.CART;
    if (this.type === Unit.Type.WORKER) {
      capacity = this.configs.parameters.RESOURCE_CAPACITY.WORKER;
    }
    return capacity - this.cargo.wood - this.cargo.coal - this.cargo.uranium;
  }
  /**
   * force unit to spend as much fuel as needed to get past upkeep amount. spends wood, then coal, then uranium
   * returns true if survived, false if not.
   */
  public spendFuelToSurvive(): boolean {
    let fuelNeeded = this.getLightUpkeep();
    const woodNeeded = Math.ceil(
      fuelNeeded / this.configs.parameters.RESOURCE_TO_FUEL_RATE.WOOD
    );
    const woodUsed = Math.min(this.cargo.wood, woodNeeded);
    fuelNeeded -= woodUsed * this.configs.parameters.RESOURCE_TO_FUEL_RATE.WOOD;
    this.cargo.wood -= woodUsed;

    if (fuelNeeded <= 0) {
      return true;
    }

    const coalNeeded = Math.ceil(
      fuelNeeded / this.configs.parameters.RESOURCE_TO_FUEL_RATE.COAL
    );
    const coalUsed = Math.min(this.cargo.coal, coalNeeded);
    fuelNeeded -= coalUsed * this.configs.parameters.RESOURCE_TO_FUEL_RATE.COAL;
    this.cargo.coal -= coalUsed;

    if (fuelNeeded <= 0) {
      return true;
    }

    const uraniumNeeded = Math.ceil(
      fuelNeeded / this.configs.parameters.RESOURCE_TO_FUEL_RATE.URANIUM
    );
    const uraniumUsed = Math.min(this.cargo.uranium, uraniumNeeded);
    fuelNeeded -=
      uraniumUsed * this.configs.parameters.RESOURCE_TO_FUEL_RATE.URANIUM;
    this.cargo.uranium -= uraniumUsed;

    if (fuelNeeded <= 0) {
      return true;
    }

    return fuelNeeded <= 0;
  }
  abstract getLightUpkeep(): number;
  abstract canMove(): boolean;
}

export namespace Unit {
  export enum Type {
    WORKER,
    CART,
  }
  /**
   * Team constants. The same as the agent ids
   */
  export enum TEAM {
    A = 0,
    B = 1,
  }
  export type Cargo = {
    [x in Resource.Types]: number;
  };
}

export class Cart extends Unit {
  constructor(x: number, y: number, team: Unit.TEAM, configs: LuxMatchConfigs) {
    super(x, y, Unit.Type.CART, team, configs);
  }
  getLightUpkeep(): number {
    return this.configs.parameters.LIGHT_UPKEEP.WORKER;
  }

  canMove(): boolean {
    return this.cooldown === 0;
  }

  turn(game: Game): void {
    if (this.currentActions.length === 1) {
      const action = this.currentActions[0];
      if (action instanceof MoveAction) {
        game.moveUnit(action.team, action.unitid, action.direction);
        this.cooldown += this.configs.parameters.UNIT_ACTION_COOLDOWN.CART;
      } else if (action instanceof TransferAction) {
        game.transferResources(
          action.team,
          action.srcID,
          action.destID,
          action.resourceType,
          action.amount
        );
        this.cooldown += this.configs.parameters.UNIT_ACTION_COOLDOWN.CART;
      }
    }

    // auto create roads by increasing the cooldown value of a cell
    const cell = game.map.getCellByPos(this.pos);
    if (cell.getTileCooldown() < this.configs.parameters.MAX_CELL_COOLDOWN) {
      cell.cooldown = Math.min(
        cell.cooldown + this.configs.parameters.CART_ROAD_DEVELOPMENT_RATE,
        this.configs.parameters.MAX_CELL_COOLDOWN
      );
    }
    if (this.cooldown > 0) {
      this.cooldown -= cell.getTileCooldown();
      if (this.cooldown < 0) {
        this.cooldown = 0;
      }
    }
  }
}

export class Worker extends Unit {
  constructor(x: number, y: number, team: Unit.TEAM, configs: LuxMatchConfigs) {
    super(x, y, Unit.Type.WORKER, team, configs);
  }
  getLightUpkeep(): number {
    return this.configs.parameters.LIGHT_UPKEEP.WORKER;
  }

  canMove(): boolean {
    return this.cooldown === 0;
  }

  turn(game: Game): void {
    if (this.currentActions.length === 1) {
      const action = this.currentActions[0];

      if (action instanceof MoveAction) {
        game.moveUnit(action.team, action.unitid, action.direction);
        this.cooldown += this.configs.parameters.UNIT_ACTION_COOLDOWN.WORKER;
      } else if (action instanceof TransferAction) {
        game.transferResources(
          action.team,
          action.srcID,
          action.destID,
          action.resourceType,
          action.amount
        );
        this.cooldown += this.configs.parameters.UNIT_ACTION_COOLDOWN.WORKER;
      } else if (action instanceof SpawnCityAction) {
        game.spawnCityTile(action.team, this.pos.x, this.pos.y);
        this.cooldown += this.configs.parameters.UNIT_ACTION_COOLDOWN.WORKER;
      } else if (action instanceof PillageAction) {
        const cell = game.map.getCellByPos(this.pos);
        cell.cooldown = Math.max(
          cell.cooldown - this.configs.parameters.PILLAGE_RATE,
          this.configs.parameters.MIN_CELL_COOLDOWN
        );
        this.cooldown += this.configs.parameters.UNIT_ACTION_COOLDOWN.WORKER;
      }
    }
    if (this.cooldown > 0) {
      this.cooldown -= game.map.getCellByPos(this.pos).getTileCooldown();
      if (this.cooldown < 0) {
        this.cooldown = 0;
      }
    }
  }
}
