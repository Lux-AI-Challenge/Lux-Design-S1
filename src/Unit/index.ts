import { genID } from '../utils';
import { LuxMatchConfigs } from '../types';

export abstract class Unit {
  public id: string;
  constructor(
    public x: number,
    public y: number,
    public type: Unit.Type,
    public team: Unit.TEAM,
    public configs: LuxMatchConfigs
  ) {
    this.id = 'u_' + genID();
  }
  abstract getLightUpkeep(): number;
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
}
