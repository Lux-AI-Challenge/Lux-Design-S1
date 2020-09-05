import { Unit, UnitType } from '.';

export class Worker extends Unit {
  constructor(x: number, y: number) {
    super(x, y, UnitType.WORKER);
  }
}
