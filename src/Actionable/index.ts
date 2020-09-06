import { LuxMatchConfigs } from '../types';
import { Game } from '../Game';

export abstract class Actionable {
  constructor(public configs: Readonly<LuxMatchConfigs>) {}
  /**
   * Process all commands for this actionable object in the match. It expects all given commands are completely valid
   * and can be run.
   */
  abstract turn(state: Game.State, commands: Array<string>): void;
}
