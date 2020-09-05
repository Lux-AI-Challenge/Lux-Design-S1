import { LuxMatchConfigs } from './types';

// some temporary default configurations and parameters
export const DEFAULT_CONFIGS: LuxMatchConfigs = {
  mapType: 'random',
  parameters: {
    DAY_LENGTH: 20,
    MAX_DAYS: 20,
    LIGHT_UPKEEP: {
      CITY: 100,
      WORKER: 20,
      CART: 80,
    },
    RESOURCE_CAPACITY: {
      WORKER: 50,
      CART: 200,
    },
    WORKER_COLLECTION_RATE: {
      WOOD: 10,
      COAL: 5,
      URANIUM: 1,
    },
    BUILD_TIME: {
      WORKER: 5,
      CART: 10,
    },
    RESEARCH_TIME: {
      COAL: 40,
      URANIUM: 60,
    },
  },
};
