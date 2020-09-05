import { genID } from '../utils';

export class Unit {
  public id: string;
  constructor(
    public x: number,
    public y: number,
    public type: Unit.Type,
    public team: Unit.TEAM
  ) {
    this.id = 'u_' + genID();
  }
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
