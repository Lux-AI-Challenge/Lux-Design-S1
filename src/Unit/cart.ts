import { Unit, UnitType } from '.';

export class Cart extends Unit {
  constructor(x: number, y: number) {
    super(x, y, UnitType.CART);
  }
}
