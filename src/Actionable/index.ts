import { LuxMatchConfigs } from '../types';
import { Game } from '../Game';

export abstract class Actionable {
  constructor(public configs: Readonly<LuxMatchConfigs>) {}
  /**
   * Process all commands for this actionable object in the match. Throws an warning whenever something not allowed
   * occurs.
   */
  abstract turn(state: Game.State, commands: Array<string>): void;
}
