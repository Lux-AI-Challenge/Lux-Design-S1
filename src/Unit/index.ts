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
