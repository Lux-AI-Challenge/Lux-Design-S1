import { Unit } from '.';
import { LuxMatchConfigs } from '../types';
import { Game } from '../Game';

export class Worker extends Unit {
  public cooldown = 0;
  constructor(x: number, y: number, team: Unit.TEAM, configs: LuxMatchConfigs) {
    super(x, y, Unit.Type.WORKER, team, configs);
  }
  getLightUpkeep(): number {
    return this.configs.parameters.LIGHT_UPKEEP.WORKER;
  }
  turn(state: Game.State, commands: Array<string>): void {
    if (this.cooldown > 0) {
      this.cooldown--;
    }
  }
}
