import 'colors';
import { Resource } from '../Resource';
import { Unit } from '../Unit';
import { City, CityTile } from './city';
import { GameMap } from '../GameMap';
import { Worker } from '../Unit/worker';
import { Cart } from '../Unit/cart';
import { LuxMatchConfigs } from '../types';
import { DEFAULT_CONFIGS } from '../defaults';
import { MatchEngine, MatchWarn } from 'dimensions-ai';
import {
  Action,
  SpawnCartAction,
  SpawnWorkerAction,
  MoveAction,
  ResearchAction,
  TransferAction,
  SpawnCityAction,
} from '../Actions';

/**
 * Holds basically all game data, including the map.
 *
 * Has the main functions for manipulating game state e.g. moving units, spawning units
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
   * Returns an Action object if validated. If invalid, throws MatchWarn
   */
  validateCommand(cmd: MatchEngine.Command): Action {
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
        case Game.ACTIONS.BUILD_CITY:
          if (strs.length === 2) {
            const unitid = strs[1];
            const unit = this.state.teamStates[team].units.get(unitid);
            if (!unit) {
              valid = false;
              errormsg = `Agent ${cmd.agentID} tried to build city with invalid/unowned unit id: ${unitid}`;
              break;
            }
            const cell = this.map.getCellByPos(unit.pos);
            if (cell.isCityTile()) {
              valid = false;
              errormsg = `Agent ${cmd.agentID} tried to build city on existing city`;
              break;
            }
            if (cell.hasResource()) {
              valid = false;
              errormsg = `Agent ${cmd.agentID} tried to build city on non-empty resource tile`;
              break;
            }
            if (valid) {
              return new SpawnCityAction(action, team, unitid);
            }
          } else {
            valid = false;
          }
          break;
        case Game.ACTIONS.BUILD_CART:
        case Game.ACTIONS.BUILD_WORKER:
          if (strs.length === 3) {
            const x = parseInt(strs[1]);
            const y = parseInt(strs[2]);
            if (isNaN(x) || isNaN(y)) {
              valid = false;
              errormsg = `Agent ${cmd.agentID} tried to build unit with invalid coordinates`;
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
            if (valid) {
              if (action === Game.ACTIONS.BUILD_CART) {
                return new SpawnCartAction(action, team, x, y);
              } else if (action === Game.ACTIONS.BUILD_WORKER) {
                return new SpawnWorkerAction(action, team, x, y);
              }
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
              case Game.DIRECTIONS.WEST: {
                const newpos = unit.pos.translate(direction, 1);
                if (!this.map.inMap(newpos)) {
                  errormsg = `Agent ${cmd.agentID} tried to move unit ${unitid} off map`;
                  valid = false;
                } else if (
                  this.map.getCellByPos(newpos).isCityTile() &&
                  this.map.getCellByPos(newpos).citytile.team !== team
                ) {
                  errormsg = `Agent ${cmd.agentID} tried to move unit ${unitid} onto opponent city`;
                  valid = false;
                }
                break;
              }
              default:
                errormsg = `Agent ${cmd.agentID} tried to move unit ${unitid} in invalid direction ${direction}`;
                valid = false;
                break;
            }
            if (valid) {
              return new MoveAction(
                action,
                team,
                unitid,
                direction as Game.DIRECTIONS
              );
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
            if (valid) {
              return new ResearchAction(action, team, x, y);
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

            if (isNaN(amount) || amount < 0) {
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
            if (valid) {
              return new TransferAction(
                action,
                team,
                srcID,
                destID,
                resourceType as Resource.Types,
                amount
              );
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
          this.destroyCity(oldcity.id);
        }
      });
      return cell.citytile;
    }
  }

  moveUnit(team: Unit.TEAM, unitid: string, direction: Game.DIRECTIONS): void {
    const unit = this.state.teamStates[team].units.get(unitid);
    unit.pos = unit.pos.translate(direction, 1);
  }

  transferResources(
    team: Unit.TEAM,
    srcID: string,
    destID: string,
    resourceType: Resource.Types,
    amount: number
  ): void {
    const srcunit = this.state.teamStates[team].units.get(srcID);
    const destunit = this.state.teamStates[team].units.get(destID);
    // the amount to actually transfer
    let transferAmount = amount;
    if (srcunit.cargo[resourceType] >= amount) {
      transferAmount = amount;
    } else {
      // when resources is below specified amount, we can only transfer as much as we can hold
      transferAmount = srcunit.cargo[resourceType];
    }
    const spaceLeft = destunit.getCargoSpaceLeft();
    // if we want to transferr more than there is space, we can only transfer what space is left
    if (transferAmount > spaceLeft) {
      transferAmount = spaceLeft;
    }
    srcunit.cargo[resourceType] -= transferAmount;
    destunit.cargo[resourceType] += transferAmount;
  }

  /** destroys the city with this id */
  destroyCity(cityID: string): boolean {
    return this.cities.delete(cityID);
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

  /**
   * All the available agent actions with specifications as to what they do and restrictions.
   */
  export enum ACTIONS {
    /**
     * Formatted as `m unitid direction`. unitid should be valid and should have empty space in that direction. moves
     * unit with id unitid in the direction
     */
    MOVE = 'm',
    /**
     * Formatted as `r x, y`. (x,y) should be an owned city tile, the city tile is commanded to research for
     * the next X turns
     */
    RESEARCH = 'r',
    /** Formatted as `bw x y`. (x,y) should be an owned city tile, where worker is to be built */
    BUILD_WORKER = 'bw',
    /** Formatted as `bc x y`. (x,y) should be an owned city tile, where the cart is to be built */
    BUILD_CART = 'bc',
    /**
     * Formatted as `bcity unitid`. builds city at unitids pos, unitid should be
     * friendly owned unit that is a worker
     */
    BUILD_CITY = 'bcity',
    /**
     * Formatted as `t source_unitid destination_unitid resource_type amount`. Both units in transfer should be
     * adjacent. If command valid, it will transfer as much as possible with a max of the amount specified
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
