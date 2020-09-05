export interface LuxMatchResults {
  ranks: Array<{ rank: number; agentID: number }>;
}

export interface LuxMatchState {
  configs: LuxMatchConfigs;
  turn: number;
}

/**
 * Configurations for a match
 */
export interface LuxMatchConfigs {
  mapType: string;
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
    BUILD_TIME: {
      WORKER: number;
      CART: number;
    };
    RESEARCH_TIME: {
      COAL: number;
      URANIUM: number;
    };
  };
}
