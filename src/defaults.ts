import { LuxMatchConfigs } from './types';
import { GameMap } from './GameMap';
import GAME_CONSTANTS from './game_constants.json';
// some temporary default configurations and parameters
export const DEFAULT_CONFIGS: LuxMatchConfigs = {
  mapType: GameMap.Types.RANDOM,
  storeReplay: true,
  seed: undefined,
  debug: false,
  debugDelay: 500,
  runProfiler: false,
  compressReplay: false,
  debugAnnotations: false,
  parameters: GAME_CONSTANTS.PARAMETERS,
};
