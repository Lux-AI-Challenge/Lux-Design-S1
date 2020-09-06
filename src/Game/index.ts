import 'colors';
import { Resource } from '../Resource';
import { Unit } from '../Unit';
import { City, CityTile } from './city';
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
    this.map = new GameMap(this.configs);
  }

  /**
   * throws error if command is valid
   */
  validateCommand(cmd: MatchEngine.Command): void {
    const strs = cmd.command.split(' ');
    if (strs.length === 0) {
      throw new MatchWarn(
        `Agent ${cmd.agentID} sent malformed command: ${cmd.command}`
      );
    } else {
      const action = strs[0];
      let valid = true;
      const team: Unit.TEAM = cmd.agentID;
      let errormsg = `Agent ${cmd.agentID} sent invalid command`;
      switch (action) {
        case Game.ACTIONS.BUILD_CART:
        case Game.ACTIONS.BUILD_WORKER:
          if (strs.length === 3) {
            const x = parseInt(strs[1]);
            const y = parseInt(strs[2]);
            if (isNaN(x) || isNaN(y)) {
              valid = false;
              errormsg = `Agent ${cmd.agentID} tried to build with invalid coordinates`;
              break;
            }
            // check if being built on owned city tile
            const cell = this.map.getCell(x, y);
            if (!cell.isCityTile() || cell.citytile.team !== team) {
              // invalid if not a city or not owned
              valid = false;
              errormsg = `Agent ${cmd.agentID} tried to build unit on tile (${x}, ${y}) that it does not own`;
              break;
            }

            const citytile = cell.citytile;
            if (!citytile.canBuildUnit()) {
              valid = false;
              errormsg = `Agent ${cmd.agentID} tried to build unit on tile (${x}, ${y}) but city still on cooldown ${citytile.cooldown}`;
              break;
            }
          } else {
            valid = false;
            break;
          }
          break;
        case Game.ACTIONS.MOVE:
          if (strs.length === 3) {
            const unitid = strs[1];
            const direction = strs[2];
            const teamState = this.state.teamStates[team];
            if (!teamState.units.has(unitid)) {
              valid = false;
              errormsg = `Agent ${cmd.agentID} tried to move unit ${unitid} that it does not own`;
              break;
            }
            const unit = teamState.units.get(unitid);
            if (!unit.canMove()) {
              errormsg = `Agent ${cmd.agentID} tried to move unit ${unitid} with cooldown: ${unit.cooldown}`;
              valid = false;
              break;
            }
            switch (direction) {
              case Game.DIRECTIONS.NORTH:
              case Game.DIRECTIONS.EAST:
              case Game.DIRECTIONS.SOUTH:
              case Game.DIRECTIONS.WEST:
                break;
              default:
                errormsg = `Agent ${cmd.agentID} tried to move unit ${unitid} in invalid direction ${direction}`;
                valid = false;
                break;
            }
          } else {
            valid = false;
          }
          break;
        case Game.ACTIONS.RESEARCH:
          if (strs.length === 3) {
            const x = parseInt(strs[1]);
            const y = parseInt(strs[2]);
            if (isNaN(x) || isNaN(y)) {
              valid = false;
              errormsg = `Agent ${cmd.agentID} tried to run research at invalid coordinates`;
              break;
            }
            // check if being researched on owned city tile
            const cell = this.map.getCell(x, y);
            if (!cell.isCityTile() || cell.citytile.team !== team) {
              // invalid if not a city or not owned
              valid = false;
              errormsg = `Agent ${cmd.agentID} tried to run research at tile (${x}, ${y}) that it does not own`;
              break;
            }
            const citytile = cell.citytile;
            if (!citytile.canResearch()) {
              valid = false;
              errormsg = `Agent ${cmd.agentID} tried to build unit on tile (${x}, ${y}) but city still on cooldown ${citytile.cooldown}`;
              break;
            }
          } else {
            valid = false;
          }
          break;
        case Game.ACTIONS.TRANSFER:
          if (strs.length === 5) {
            const srcID = strs[1];
            const destID = strs[2];
            const resourceType = strs[3];
            const amount = parseInt(strs[4]);
            const teamState = this.state.teamStates[team];
            if (!teamState.units.has(srcID)) {
              valid = false;
              errormsg = `Agent ${cmd.agentID} does not own source unit: ${srcID} for transfer`;
              break;
            }
            if (!teamState.units.has(destID)) {
              valid = false;
              errormsg = `Agent ${cmd.agentID} does not own destination unit: ${srcID} for transfer`;
              break;
            }
            const srcUnit = teamState.units.get(srcID);
            const destUnit = teamState.units.get(destID);
            if (srcID === destID) {
              valid = false;
              errormsg = `Agent ${cmd.agentID} tried to transfer between the same unit ${srcID}`;
              break;
            }
            if (!srcUnit.pos.isAdjacent(destUnit.pos)) {
              valid = false;
              errormsg = `Agent ${cmd.agentID} tried to transfer between non-adjacent units: ${srcID}, ${destID}`;
              break;
            }

            if (isNaN(amount)) {
              valid = false;
              errormsg = `Agent ${cmd.agentID} tried to transfer invalid amount: ${strs[3]}`;
              break;
            }
            switch (resourceType) {
              case Resource.Types.WOOD:
              case Resource.Types.COAL:
              case Resource.Types.URANIUM:
                break;
              default:
                valid = false;
                errormsg = `Agent ${cmd.agentID} tried to transfer invalid resource: ${resourceType}`;
                break;
            }
          } else {
            valid = false;
          }
          break;
        default:
          valid = false;
      }
      if (valid === false) {
        throw new MatchWarn(errormsg + `; cmd: ${cmd.command}`);
      }
    }
  }

  spawnWorker(team: Unit.TEAM, x: number, y: number): Worker {
    const cell = this.map.getCell(x, y);
    const unit = new Worker(x, y, team, this.configs);
    cell.units.set(unit.id, unit);
    this.state.teamStates[team].units.set(unit.id, unit);
    return unit;
  }

  spawnCart(team: Unit.TEAM, x: number, y: number): Cart {
    const cell = this.map.getCell(x, y);
    const unit = new Cart(x, y, team, this.configs);
    cell.units.set(unit.id, unit);
    this.state.teamStates[team].units.set(unit.id, unit);
    return unit;
  }

  /**
   * Spawn city tile for a team at (x, y)
   */
  spawnCityTile(team: Unit.TEAM, x: number, y: number): CityTile {
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
      return cell.citytile;
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
      return cell.citytile;
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
    /** Formatted as `m unitid direction`. unitid should be valid and should have empty space in that direction */
    MOVE = 'm',
    /** Formatted as `r x, y`. (x,y) should be an owned city tile */
    RESEARCH = 'r',
    /** Formatted as `bw x y`. (x,y) should be an owned city tile */
    BUILD_WORKER = 'bw',
    /** Formatted as `bc x y`. (x,y) should be an owned city tile */
    BUILD_CART = 'bc',
    /**
     * Formatted as `t source_unitid destination_unitid resource_type amount`. Both units in transfer should be
     * adjacent
     */
    TRANSFER = 't',
  }

  export enum DIRECTIONS {
    NORTH = 'n',
    EAST = 'e',
    SOUTH = 's',
    WEST = 'w',
  }
}
