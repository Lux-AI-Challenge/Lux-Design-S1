import 'colors';
import { Resource } from '../Resource';
import { Unit } from '../Unit';
import { City } from './city';
import { GameMap } from '../GameMap';
import { Worker } from '../Unit/worker';
import { Cart } from '../Unit/cart';
import { LuxMatchConfigs } from '../types';
import { DEFAULT_CONFIGS } from '../defaults';
import { MatchError, MatchEngine, MatchWarn } from 'dimensions-ai';

/**
 * Holds basically all game data, including the map
 *
 * All entities that require light are any Units or Cities
 */
export class Game {
  /**
   * The actual map
   */
  public map: GameMap;

  /**
   * Map a internal city id to the array of cells that are city tiles part of the same city
   */
  public cities: Map<string, City> = new Map();

  public stats: Game.Stats = {
    teamStats: {
      [Unit.TEAM.A]: {
        fuelGenerated: 0,
        resourcesCollected: {
          wood: 0,
          coal: 0,
          uranium: 0,
        },
      },
      [Unit.TEAM.B]: {
        fuelGenerated: 0,
        resourcesCollected: {
          wood: 0,
          coal: 0,
          uranium: 0,
        },
      },
    },
  };

  public state: Game.State = {
    turn: 0,
    teamStates: {
      [Unit.TEAM.A]: {
        researchPoints: 0,
        units: new Map(),
        fuel: 0,
      },
      [Unit.TEAM.B]: {
        researchPoints: 0,
        units: new Map(),
        fuel: 0,
      },
    },
  };

  public configs: Readonly<LuxMatchConfigs> = { ...DEFAULT_CONFIGS };
  /**
   * Initialize a game, with all its state and stats
   * @param configs
   */
  constructor(configs: Readonly<Partial<LuxMatchConfigs>> = {}) {
    this.configs = {
      ...this.configs,
      ...configs,
    };
    this.map = new GameMap(this.configs.width, this.configs.height);
  }

  /**
   * throws error if command is invalid
   */
  validateCommand(cmd: MatchEngine.Command): void {
    const strs = cmd.command.split(' ');
    if (strs.length === 0) {
      throw new MatchWarn(
        `Agent ${cmd.agentID} sent malformed command: ${cmd.command}`
      );
    } else {
      const action = strs[0];
      if (action in Game.ACTIONS) {
        switch (action) {
          case Game.ACTIONS.BUILD_CART:
            break;
          case Game.ACTIONS.BUILD_WORKER:
            break;
          case Game.ACTIONS.MOVE:
            break;
          case Game.ACTIONS.RESEARCH:
            break;
        }
      } else {
        throw new MatchWarn(
          `Agent ${cmd.agentID} sent invalid command: ${cmd.command}`
        );
      }
    }
  }

  spawnWorker(team: Unit.TEAM, x: number, y: number): void {
    const cell = this.map.getCell(x, y);
    const unit = new Worker(x, y, team, this.configs);
    cell.units.set(unit.id, unit);
    this.state.teamStates[team].units.set(unit.id, unit);
  }

  spawnCart(team: Unit.TEAM, x: number, y: number): void {
    const cell = this.map.getCell(x, y);
    const unit = new Cart(x, y, team, this.configs);
    cell.units.set(unit.id, unit);
    this.state.teamStates[team].units.set(unit.id, unit);
  }

  /**
   * Spawn city tile for a team at (x, y)
   */
  spawnCityTile(team: Unit.TEAM, x: number, y: number): City {
    const cell = this.map.getCell(x, y);

    // now update the cities field accordingly
    const adjCells = this.map.getAdjacentCells(cell);

    const cityIdsFound: Set<string> = new Set();
    const adjSameTeamCityTiles = adjCells.filter((cell) => {
      if (cell.isCityTile() && cell.citytile.team === team) {
        cityIdsFound.add(cell.citytile.cityid);
        return true;
      }
      return false;
    });

    // if no adjacent city cells of same team, generate new city
    if (adjSameTeamCityTiles.length === 0) {
      const city = new City(team, this.configs);
      cell.setCityTile(team, city.id);
      city.addCityTile(cell);
      this.cities.set(city.id, city);
      return city;
    }
    // otherwise add tile to city
    else {
      const cityid = adjSameTeamCityTiles[0].citytile.cityid;
      const city = this.cities.get(cityid);
      cell.setCityTile(team, cityid);
      city.addCityTile(cell);

      // update all merged cities' cells with merged cityid, move to merged city and delete old city
      cityIdsFound.forEach((id) => {
        if (id !== cityid) {
          const oldcity = this.cities.get(id);
          oldcity.citycells.forEach((cell) => {
            cell.citytile.cityid = cityid;
            city.addCityTile(cell);
          });
          city.fuel += oldcity.fuel;
          this.cities.delete(id);
        }
      });
      return city;
    }
  }

  /** destroys the city with this id */
  destroyCity(cityId: string): boolean {
    return this.cities.delete(cityId);
  }
}
export namespace Game {
  export interface Configs {
    width: number;
    height: number;
    parameters: LuxMatchConfigs;
  }
  export interface Stats {
    teamStats: {
      [x in Unit.TEAM]: TeamStats;
    };
  }
  export interface TeamStats {
    fuelGenerated: number;
    resourcesCollected: {
      [x in Resource.Types]: number;
    };
  }
  export interface State {
    turn: number;
    teamStates: {
      [x in Unit.TEAM]: TeamState;
    };
  }
  export interface TeamState {
    fuel: number;
    researchPoints: number;
    units: Map<string, Unit>;
  }

  export enum ACTIONS {
    MOVE = 'm',
    RESEARCH = 'r',
    BUILD_WORKER = 'bw',
    BUILD_CART = 'bc',
  }

  export enum DIRECTIONS {
    NORTH = 'n',
    EAST = 'e',
    SOUTH = 's',
    WEST = 'w',
  }
}
