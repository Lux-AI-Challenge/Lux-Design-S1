import { Unit } from '.';
import { LuxMatchConfigs } from '../types';
import { Game } from '../Game';
import { MoveAction, TransferAction } from '../Actions';
import { MatchWarn } from 'dimensions-ai';

export class Cart extends Unit {
  constructor(x: number, y: number, team: Unit.TEAM, configs: LuxMatchConfigs) {
    super(x, y, Unit.Type.CART, team, configs);
  }
  getLightUpkeep(): number {
    return this.configs.parameters.LIGHT_UPKEEP.WORKER;
  }

  canMove(): boolean {
    return this.cooldown === 0;
  }

  turn(game: Game): void {
    if (this.cooldown > 0) {
      this.cooldown--;
    }
    if (this.currentActions.length === 1) {
      const action = this.currentActions[0];
      if (action instanceof MoveAction) {
        game.moveUnit(action.team, action.unitid, action.direction);
        this.cooldown += this.configs.parameters.UNIT_ACTION_COOLDOWN.CART;
      } else if (action instanceof TransferAction) {
        game.transferResources(
          action.team,
          action.srcID,
          action.destID,
          action.resourceType,
          action.amount
        );
      }
    } else if (this.currentActions.length > 1) {
      throw new MatchWarn(
        `Agent ${this.team} tried to run more than 1 action for cart: ${this.id}`
      );
    }
  }
}
