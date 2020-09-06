import { Unit } from '.';
import { LuxMatchConfigs } from '../types';
import { Game } from '../Game';

export class Worker extends Unit {
  constructor(x: number, y: number, team: Unit.TEAM, configs: LuxMatchConfigs) {
    super(x, y, Unit.Type.WORKER, team, configs);
  }
  getLightUpkeep(): number {
    return this.configs.parameters.LIGHT_UPKEEP.WORKER;
  }

  canMove(): boolean {
    return this.cooldown === 0;
  }

  turn(game: Game, commands: Array<string>): void {
    if (this.cooldown > 0) {
      this.cooldown--;
    }
  }
}
