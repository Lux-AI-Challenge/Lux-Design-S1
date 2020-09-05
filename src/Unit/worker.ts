import { Unit } from '.';
import { LuxMatchConfigs } from '../types';

export class Worker extends Unit {
  public cooldown = 0;
  constructor(x: number, y: number, team: Unit.TEAM, configs: LuxMatchConfigs) {
    super(x, y, Unit.Type.WORKER, team, configs);
  }
  getLightUpkeep(): number {
    return this.configs.parameters.LIGHT_UPKEEP.WORKER;
  }
  turn(commands: Array<string>): void {
    if (this.cooldown > 0) {
      this.cooldown--;
    }
  }
}
