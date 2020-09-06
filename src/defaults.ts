import { LuxMatchConfigs } from './types';
import { GameMap } from './GameMap';

// some temporary default configurations and parameters
export const DEFAULT_CONFIGS: LuxMatchConfigs = {
  mapType: GameMap.Types.RANDOM,
  width: 16,
  height: 16,
  seed: undefined,
  parameters: {
    DAY_LENGTH: 20,
    MAX_DAYS: 20,
    LIGHT_UPKEEP: {
      CITY: 100,
      WORKER: 20,
      CART: 80,
    },
    RESOURCE_CAPACITY: {
      WORKER: 100,
      CART: 400,
    },
    WORKER_COLLECTION_RATE: {
      WOOD: 20,
      COAL: 10,
      URANIUM: 1,
    },
    RESOURCE_TO_FUEL_RATE: {
      WOOD: 1,
      COAL: 5,
      URANIUM: 20,
    },
    BUILD_TIME: {
      WORKER: 5,
      CART: 10,
    },
    RESEARCH_TIME: {
      COAL: 40,
      URANIUM: 60,
    },
    CITY_ACTION_COOLDOWN: 10,
    UNIT_ACTION_COOLDOWN: {
      CART: 3,
      WORKER: 1,
    },
  },
};
