import { LuxMatchConfigs } from '../types';
import { Actionable } from '../Actionable';
import { Position } from '../GameMap/position';
import { Resource } from '../Resource';

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
