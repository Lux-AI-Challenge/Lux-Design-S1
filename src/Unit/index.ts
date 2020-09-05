import { genID } from '../utils';
import { LuxMatchConfigs } from '../types';
import { Actionable } from '../Actionable';

export abstract class Unit extends Actionable {
  public id: string;
  constructor(
    public x: number,
    public y: number,
    public type: Unit.Type,
    public team: Unit.TEAM,
    configs: LuxMatchConfigs
  ) {
    super(configs);
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
