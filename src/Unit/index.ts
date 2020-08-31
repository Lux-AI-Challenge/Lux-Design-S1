export enum UnitType {
  WORKER,
  CART,
}
export class Unit {
  constructor(public x: number, public y: number, public type: UnitType) {

  }
}