import { Cell } from './cell';
import 'colors';
import { Resource } from '../Resource';
import { Unit } from '../Unit';
import { genID } from '../utils';
import { City } from './city';
import { GameMap } from '../GameMap';

/**
 * Holds basically all game data, including the map
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
        fuel: 0,
      },
      [Unit.TEAM.B]: {
        fuel: 0,
      },
    },
  };

  public configs: Game.Configs = {
    width: 16,
    height: 16,
  };
  /**
   * Initialize a game, with all its state and stats
   * @param configs
   */
  constructor(configs: Partial<Game.Configs> = {}) {
    this.configs = {
      ...this.configs,
      ...configs,
    };
    this.map = new GameMap(this.configs.width, this.configs.height);
  }

  /**
   * Spawn city tile for a team at (x, y)
   */
  spawnCityTile(team: Unit.TEAM, x: number, y: number): void {
    const cell = this.map.getCell(x, y);
    cell.setCityTile(team);
    // now update the cities field accordingly
    const adjCells = this.map.getAdjacentCells(cell);

    const adjSameTeamCityTiles = adjCells.filter((cell) => {
      return cell.isCityTile() && cell.citytile.team === team;
    });

    // if no adjacent city cells of same team, generate new city
    if (adjSameTeamCityTiles.length === 0) {
      const cityid = genID();
      cell.citytile.cityid = cityid;
      const city = new City(cityid, team);
      city.addCityTile(cell);
      this.cities.set(cityid, city);
    }
    // otherwise add tile to city
    else {
      const cityid = adjSameTeamCityTiles[0].citytile.cityid;
      const city = this.cities.get(cityid);
      city.addCityTile(cell);
    }
  }
}
export namespace Game {
  export interface Configs {
    width: number;
    height: number;
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
  }
}
