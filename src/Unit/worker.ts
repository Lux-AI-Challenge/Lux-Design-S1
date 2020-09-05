import { Unit } from '.';

export class Worker extends Unit {
  constructor(x: number, y: number, team: Unit.TEAM) {
    super(x, y, Unit.Type.WORKER, team);
  }
}
