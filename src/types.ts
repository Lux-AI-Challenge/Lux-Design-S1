import { Game } from './Game';
import { GameMap } from './GameMap';

export interface LuxMatchResults {
  ranks: Array<{ rank: number; agentID: number }>;
}

export interface LuxMatchState {
  configs: LuxMatchConfigs;
  game: Game;
  rng: () => number;
}

/**
 * Configurations for a match
 */
export interface LuxMatchConfigs {
  mapType: GameMap.Types;
  width: number;
  height: number;

  seed: number | undefined;
  parameters: {
    DAY_LENGTH: number;
    MAX_DAYS: number;
    LIGHT_UPKEEP: {
      CITY: number;
      WORKER: number;
      CART: number;
    };
    RESOURCE_CAPACITY: {
      WORKER: number;
      CART: number;
    };
    WORKER_COLLECTION_RATE: {
      WOOD: number;
      COAL: number;
      URANIUM: number;
    };
    RESOURCE_TO_FUEL_RATE: {
      WOOD: number;
      COAL: number;
      URANIUM: number;
    };
    BUILD_TIME: {
      WORKER: number;
      CART: number;
    };
    RESEARCH_TIME: {
      COAL: number;
      URANIUM: number;
    };
    CITY_ACTION_COOLDOWN: number;
    UNIT_ACTION_COOLDOWN: {
      CART: number;
      WORKER: number;
    };
  };
}
