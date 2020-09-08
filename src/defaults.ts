import { LuxMatchConfigs } from './types';
import { GameMap } from './GameMap';
import GAME_CONSTANTS from './game_constants.json';
// some temporary default configurations and parameters
export const DEFAULT_CONFIGS: LuxMatchConfigs = {
  mapType: GameMap.Types.RANDOM,
  width: 16,
  height: 16,
  seed: undefined,
  debugDelay: 500,
  parameters: GAME_CONSTANTS.PARAMETERS,
};
