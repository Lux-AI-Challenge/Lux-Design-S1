export class Unit {
  constructor(
    public x: number,
    public y: number,
    public type: Unit.Type,
    public team: Unit.TEAM
  ) {}
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
