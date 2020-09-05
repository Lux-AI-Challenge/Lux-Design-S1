import { Unit } from '.';

export class Cart extends Unit {
  constructor(x: number, y: number, team: Unit.TEAM) {
    super(x, y, Unit.Type.CART, team);
  }
}
