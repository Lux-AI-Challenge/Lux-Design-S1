import { Unit } from '.';
import { LuxMatchConfigs } from '../types';

export class Worker extends Unit {
  constructor(x: number, y: number, team: Unit.TEAM, configs: LuxMatchConfigs) {
    super(x, y, Unit.Type.WORKER, team, configs);
  }
  getLightUpkeep(): number {
    return this.configs.parameters.LIGHT_UPKEEP.WORKER;
  }
}
