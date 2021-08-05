import { Game } from './Game';
import { GameMap } from './GameMap';
import { Resource } from './Resource';
import { Unit } from './Unit';

export interface LuxMatchResults {
  ranks: Array<{ rank: number; agentID: number }>;
}

export interface LuxMatchState {
  configs: LuxMatchConfigs;
  game: Game;
  profile: {
    dataTransfer: Array<number>;
    updateStage: Array<number>;
  };
  rng: () => number;
}

/**
 * Configurations for a match
 */
export interface LuxMatchConfigs {
  /**
   * Whether to generate replay file and store it locally
   * @default true
   */
  storeReplay: boolean;
  /**
   * Whether to generate a stateful replay in addition to the current format
   * @default false
   */
  statefulReplay: boolean;
  /**
   * where to write the replay file. Default will write to a replays folder and name it as so <date>_<match_id>.json
   */
  out?: string;
  /**
   * Whether to compress replay into a unreadable binary format or leave it as json
   * @default false
   */
  compressReplay: boolean;
  mapType: GameMap.Types;
  // we can set a forced width and height if necessary
  width?: number;
  height?: number;
  debug?: boolean;
  runProfiler: boolean;
  debugDelay: number;
  /**
   * whether to store debug annotations in the replay for viewing.
   * @default false
   */
  debugAnnotations: boolean;
  seed: number | undefined;
  parameters: {
    /** how long in turns the day period is */
    DAY_LENGTH: number;
    /** how long in turns the night period is */
    NIGHT_LENGTH: number;
    // TODO: this is used as turns at the moment
    /** max number of days in the match before it concludes and a winner is determined */
    MAX_DAYS: number;
    LIGHT_UPKEEP: {
      /** fuel cost for city to survive a turn of night */
      CITY: number;
      /** fuel cost for a worker to survive a turn of night */
      WORKER: number;
      /** fuel cost for a cart to survive a turn of night */
      CART: number;
    };
    /** how much of resources units can carry before being unable to receive more resources by transfer or mining */
    RESOURCE_CAPACITY: {
      WORKER: number;
      CART: number;
    };
    /** how fast a worker collects resources from adjacent tiles. If there are several adjacent tiles with resources, worker collects at the same rate from all tiles until cargo is full */
    WORKER_COLLECTION_RATE: {
      WOOD: number;
      COAL: number;
      URANIUM: number;
    };
    /** conversion rate of resources in units to fuel in units */
    RESOURCE_TO_FUEL_RATE: {
      WOOD: number;
      COAL: number;
      URANIUM: number;
    };
    /** How much lower fuel cost a city has during night if it has adjacent city tiles */
    CITY_ADJACENCY_BONUS: number;
    /** resource cost for a worker to build a city (agnostic to resource type, any CITY_BUILD_COST amount is good) */
    CITY_BUILD_COST: number;
    /** grow rate of wood tiles */
    WOOD_GROWTH_RATE: number;
    /** max wood allowed in a wood tile */
    MAX_WOOD_AMOUNT: number;
    /** Number of research points required to unlock the mining of the following resources */
    RESEARCH_REQUIREMENTS: {
      COAL: number;
      URANIUM: number;
    };
    /** Cooldown for actions of a city, e.g. research, spawn units */
    CITY_ACTION_COOLDOWN: number;
    /** Cooldown for actions of the units, being movement or resource transfer to another unit, or building a city */
    UNIT_ACTION_COOLDOWN: {
      CART: number;
      WORKER: number;
    };
    /** Maximum road level, before road can no longer be developed further */
    MAX_ROAD: number;
    /** how fast carts develop roads, specifically value is equal to how much to increase cooldown reduction of a tile */
    CART_ROAD_DEVELOPMENT_RATE: number;
    /** how fast workers pillage roads, specifically value is equal to how much to decrease cooldown reduction of a tile  */
    PILLAGE_RATE: number;
    /** Minimum road level */
    MIN_ROAD: number;
  };
}

export interface SerializedState {
  turn: number;
  globalCityIDCount: number;
  globalUnitIDCount: number;
  teamStates: {
    [x in Unit.TEAM]: {
      researchPoints: number;
      units: Record<
        string,
        {
          cargo: Unit['cargo'];
          cooldown: number;
          x: number;
          y: number;
          type: Unit['type'];
        }
      >;
      researched: {
        [x in Resource.Types]: boolean;
      };
    };
  };
  map: Array<
    Array<{
      road: number;
      resource?: { type: string; amount: number };
    }>
  >;
  stats: Game.Stats;
  cities: Record<
    string,
    {
      cityCells: Array<{ x: number; y: number; cooldown: number }>;
      id: string;
      fuel: number;
      lightupkeep: number;
      team: number;
    }
  >;
}
