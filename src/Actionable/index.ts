import { LuxMatchConfigs } from '../types';
import { Game } from '../Game';
import { Action } from '../Actions';

// any entity that has actions that are "a per unit" basis (not global) must extends this
export abstract class Actionable {
  // array of actions to handle in turn function
  public currentActions: Array<Action> = [];
  constructor(public configs: Readonly<LuxMatchConfigs>) {}
  /**
   * Process all commands for this actionable object in the match. It expects all given commands are completely valid
   * and can be run.
   */
  abstract turn(game: Game): void;

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
