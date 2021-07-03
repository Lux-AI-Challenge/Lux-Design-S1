import { LuxMatchConfigs } from '../types';
import { Game } from '../Game';
import { Action } from '../Actions';

// any entity that has actions that are "a per unit" basis (not global) must extends this
export abstract class Actionable {
  // array of actions to handle in turn function
  public currentActions: Array<Action> = [];
  /** cooldown for this object before it can act */
  public cooldown = 0;

  constructor(public configs: Readonly<LuxMatchConfigs>) {}
  /**
   * Process all commands for this actionable object in the match. It expects all given commands are completely valid
   * and can be run.
   */
  abstract turn(game: Game): void;

  /**
   * Checks if the cooldown is low enough to act again
   */
  canAct(): boolean {
    return (this.cooldown < 1);
  }

  /**
   * Game runs this function
   */
  handleTurn(game: Game): void {
    try {
      this.turn(game);
    } finally {
      this.currentActions = [];
    }
    // reset actions to empty
  }
  giveAction(action: Action): void {
    this.currentActions.push(action);
  }
}
