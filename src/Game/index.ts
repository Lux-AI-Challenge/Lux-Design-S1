import 'colors';
import { Resource } from '../Resource';
import { Unit } from '../Unit';
import { City, CityTile } from './city';
import { GameMap } from '../GameMap';
import { Cart, Worker } from '../Unit';
import { LuxMatchConfigs } from '../types';
import { DEFAULT_CONFIGS } from '../defaults';
import { MatchWarn } from 'dimensions-ai/lib/main/DimensionError';
import { MatchEngine, Match } from 'dimensions-ai';
import {
  Action,
  SpawnCartAction,
  SpawnWorkerAction,
  MoveAction,
  ResearchAction,
  TransferAction,
  SpawnCityAction,
  PillageAction,
} from '../Actions';
import { Cell } from '../GameMap/cell';
import { Replay } from '../Replay';

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

  public replay: Replay;

  public globalCityIDCount = 0;
  public globalUnitIDCount = 0;

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
        cityTilesBuilt: 0,
        workersBuilt: 0,
        cartsBuilt: 0,
        roadsBuilt: 0,
        roadsPillaged: 0,
      },
      [Unit.TEAM.B]: {
        fuelGenerated: 0,
        resourcesCollected: {
          wood: 0,
          coal: 0,
          uranium: 0,
        },
        cityTilesBuilt: 0,
        workersBuilt: 0,
        cartsBuilt: 0,
        roadsBuilt: 0,
        roadsPillaged: 0,
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
        researched: {
          wood: true,
          coal: false,
          uranium: false,
        },
      },
      [Unit.TEAM.B]: {
        researchPoints: 0,
        units: new Map(),
        fuel: 0,
        researched: {
          wood: true,
          coal: false,
          uranium: false,
        },
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

  _genInitialAccumulatedActionStats(): _AccumulatedActionStats {
    return {
      [Unit.TEAM.A]: {
        workersBuilt: 0,
        cartsBuilt: 0,
        actionsPlaced: new Set(),
      },
      [Unit.TEAM.B]: {
        workersBuilt: 0,
        cartsBuilt: 0,
        actionsPlaced: new Set(),
      },
    };
  }

  /**
   * Returns an Action object if validated. If invalid, throws MatchWarn
   */
  validateCommand(
    cmd: MatchEngine.Command,
    accumulatedActionStats: _AccumulatedActionStats = this._genInitialAccumulatedActionStats()
  ): Action {
    const strs = cmd.command.split(' ');
    if (strs.length === 0) {
      throw new MatchWarn(
        `Agent ${cmd.agentID} sent malformed command: ${cmd.command}`
      );
    } else {
      const action = strs[0];
      let valid = true;
      const team: Unit.TEAM = cmd.agentID;
      const acc = accumulatedActionStats[team];
      let errormsg = `Agent ${cmd.agentID} sent invalid command`;
      switch (action) {
        case Game.ACTIONS.DEBUG_ANNOTATE_CIRCLE:
        case Game.ACTIONS.DEBUG_ANNOTATION_LINE:
        case Game.ACTIONS.DEBUG_ANNOTATE_X:
          // these actions go directly into the replay file if debugAnnotations is on
          return null;
        case Game.ACTIONS.PILLAGE:
          if (strs.length === 2) {
            const unitid = strs[1];
            const unit = this.getUnit(team, unitid);
            if (!unit) {
              valid = false;
              errormsg = `Agent ${cmd.agentID} tried to pillage tile with invalid/unowned unit id: ${unitid}`;
              break;
            }
            if (acc.actionsPlaced.has(unitid)) {
              valid = false;
              errormsg = `Agent ${cmd.agentID} sent an extra command. Unit can perform only one action at a time`;
              break;
            }
            acc.actionsPlaced.add(unitid);
            if (valid) {
              return new PillageAction(action, team, unitid);
            }
          } else {
            valid = false;
          }
          break;
        case Game.ACTIONS.BUILD_CITY:
          if (strs.length === 2) {
            const unitid = strs[1];
            const unit = this.getUnit(team, unitid);
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
            if (acc.actionsPlaced.has(unitid)) {
              valid = false;
              errormsg = `Agent ${cmd.agentID} sent an extra command. Unit can perform only one action at a time`;
              break;
            }
            acc.actionsPlaced.add(unitid);
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
            if (acc.actionsPlaced.has(citytile.getTileID())) {
              valid = false;
              errormsg = `Agent ${cmd.agentID} sent an extra command. City can perform only one action at a time`;
              break;
            }
            acc.actionsPlaced.add(citytile.getTileID());
            if (!citytile.canBuildUnit()) {
              valid = false;
              errormsg = `Agent ${cmd.agentID} tried to build unit on tile (${x}, ${y}) but city still on cooldown ${citytile.cooldown}`;
              break;
            }
            if (action === Game.ACTIONS.BUILD_CART) {
              if (this.cartUnitCapReached(team, acc.cartsBuilt)) {
                valid = false;
                errormsg = `Agent ${cmd.agentID} tried to build unit on tile (${x}, ${y}) but cart unit cap reached. Build more cities!`;
                break;
              }
            } else {
              if (this.workerUnitCapReached(team, acc.workersBuilt)) {
                valid = false;
                errormsg = `Agent ${cmd.agentID} tried to build unit on tile (${x}, ${y}) but worker unit cap reached. Build more cities!`;
                break;
              }
            }
            if (valid) {
              if (action === Game.ACTIONS.BUILD_CART) {
                acc.cartsBuilt += 1;
                return new SpawnCartAction(action, team, x, y);
              } else if (action === Game.ACTIONS.BUILD_WORKER) {
                acc.workersBuilt += 1;
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
            if (acc.actionsPlaced.has(unitid)) {
              valid = false;
              errormsg = `Agent ${cmd.agentID} sent an extra command. Unit can perform only one action at a time`;
              break;
            }
            acc.actionsPlaced.add(unitid);
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
              case Game.DIRECTIONS.CENTER: {
                // do nothing
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
                direction as Game.DIRECTIONS,
                this.map.getCellByPos(
                  unit.pos.translate(direction as Game.DIRECTIONS, 1)
                )
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
              errormsg = `Agent ${cmd.agentID} tried to run research at tile (${x}, ${y}) but city still on cooldown ${citytile.cooldown}`;
              break;
            }
            if (acc.actionsPlaced.has(citytile.getTileID())) {
              valid = false;
              errormsg = `Agent ${cmd.agentID} sent an extra command. City can perform only one action at a time`;
              break;
            }
            acc.actionsPlaced.add(citytile.getTileID());
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
            if (acc.actionsPlaced.has(srcID)) {
              valid = false;
              errormsg = `Agent ${cmd.agentID} sent an extra command. Unit can perform only one action at a time`;
              break;
            }
            acc.actionsPlaced.add(srcID);
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
        throw new MatchWarn(
          errormsg + `; turn ${this.state.turn}; cmd: ${cmd.command}`
        );
      }
    }
  }

  workerUnitCapReached(team: Unit.TEAM, offset = 0): boolean {
    let teamCityTilesCount = 0;
    this.cities.forEach((city) => {
      if (city.team === team) {
        teamCityTilesCount += city.citycells.length;
      }
    });
    return (
      this.state.teamStates[team].units.size + offset >= teamCityTilesCount
    );
  }

  cartUnitCapReached(team: Unit.TEAM, offset = 0): boolean {
    let teamCityTilesCount = 0;
    this.cities.forEach((city) => {
      if (city.team === team) {
        teamCityTilesCount += city.citycells.length;
      }
    });
    return (
      this.state.teamStates[team].units.size + offset >= teamCityTilesCount
    );
  }

  spawnWorker(team: Unit.TEAM, x: number, y: number, unitid?: string): Worker {
    const cell = this.map.getCell(x, y);
    const unit = new Worker(x, y, team, this.configs, this.globalUnitIDCount++);
    if (unitid) {
      unit.id = unitid;
    }
    cell.units.set(unit.id, unit);
    this.state.teamStates[team].units.set(unit.id, unit);
    this.stats.teamStats[team].workersBuilt += 1;
    return unit;
  }

  spawnCart(team: Unit.TEAM, x: number, y: number, unitid?: string): Cart {
    const cell = this.map.getCell(x, y);
    const unit = new Cart(x, y, team, this.configs, this.globalUnitIDCount++);
    if (unitid) {
      unit.id = unitid;
    }
    cell.units.set(unit.id, unit);
    this.state.teamStates[team].units.set(unit.id, unit);
    this.stats.teamStats[team].cartsBuilt += 1;
    return unit;
  }

  /**
   * Spawn city tile for a team at (x, y)
   */
  spawnCityTile(
    team: Unit.TEAM,
    x: number,
    y: number,
    cityid?: string
  ): CityTile {
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

    // set cooldown to minimum as city auto gives max cooldown to units and once city is gone it should default to min cell cooldown
    cell.cooldown = this.configs.parameters.MIN_CELL_COOLDOWN;

    // if no adjacent city cells of same team, generate new city
    if (adjSameTeamCityTiles.length === 0) {
      const city = new City(team, this.configs, this.globalCityIDCount++);
      if (cityid) {
        city.id = cityid;
      }
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

      // update adjacency counts for bonuses
      cell.citytile.adjacentCityTiles = adjSameTeamCityTiles.length;
      adjSameTeamCityTiles.forEach((adjCell) => {
        adjCell.citytile.adjacentCityTiles += 1;
      });

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
          this.cities.delete(oldcity.id);
        }
      });
      return cell.citytile;
    }
  }

  /**
   * Move specified unit in specified direction
   */
  moveUnit(team: Unit.TEAM, unitid: string, direction: Game.DIRECTIONS): void {
    const unit = this.getUnit(team, unitid);
    // remove unit from old cell and move to new one and update unit pos
    this.map.getCellByPos(unit.pos).units.delete(unit.id);
    unit.pos = unit.pos.translate(direction, 1);
    this.map.getCellByPos(unit.pos).units.set(unit.id, unit);
  }

  /**
   * For cells with resources, this will release the resource to all adjacent workers (including any unit on top) in a
   * even manner and taking in account for the worker's team's research level. This is effectively a worker mining.
   *
   * Workers adjacent will only receive resources if they can mine it. They will
   * never receive more than they carry
   *
   * This function is called on cells in the order of uranium, coal, then wood resource deposits
   *
   *
   * @param cell - a cell with a resource
   */
  handleResourceRelease(originalCell: Cell): void {
    // TODO: Look into what happens if theres like only 1 uranium left or something.
    // No workers will get any resources probably, but should this be what we let happen?
    if (originalCell.hasResource()) {
      const type = originalCell.resource.type;
      const cells = [originalCell, ...this.map.getAdjacentCells(originalCell)];
      const workersToReceiveResources: Array<Worker> = [];
      for (const cell of cells) {
        cell.units.forEach((unit) => {
          if (
            unit.type === Unit.Type.WORKER &&
            this.state.teamStates[unit.team].researched[type]
          ) {
            workersToReceiveResources.push(unit);
          }
        });
      }

      let rate: number;
      switch (type) {
        case Resource.Types.WOOD:
          rate = this.configs.parameters.WORKER_COLLECTION_RATE.WOOD;
          break;
        case Resource.Types.COAL:
          rate = this.configs.parameters.WORKER_COLLECTION_RATE.COAL;
          break;
        case Resource.Types.URANIUM:
          rate = this.configs.parameters.WORKER_COLLECTION_RATE.URANIUM;
          break;
      }
      // find out how many resources to distribute and release
      let amountToDistribute = rate * workersToReceiveResources.length;
      let amountDistributed = 0;
      // distribute only as much as the cell contains
      amountToDistribute = Math.min(
        amountToDistribute,
        originalCell.resource.amount
      );

      // distribute resources as evenly as possible

      // sort from least space to most so those with more capacity will have the correct distribution of resources before we reach cargo capacity
      workersToReceiveResources.sort(
        (a, b) => a.getCargoSpaceLeft() - b.getCargoSpaceLeft()
      );

      workersToReceiveResources.forEach((worker, i) => {
        const spaceLeft = worker.getCargoSpaceLeft();
        const maxReceivable =
          amountToDistribute / (workersToReceiveResources.length - i);

        const distributeAmount = Math.min(spaceLeft, maxReceivable, rate);
        // we give workers a floored amount for sake of integers and effectiely waste the remainder
        worker.cargo[type] += Math.floor(distributeAmount);

        amountDistributed += distributeAmount;

        // update stats
        this.stats.teamStats[worker.team].resourcesCollected[
          type
        ] += Math.floor(distributeAmount);

        // subtract how much was given.
        amountToDistribute -= distributeAmount;
      });

      originalCell.resource.amount -= amountDistributed;
    }
  }

  /**
   * Auto deposit resources of unit to tile it is on
   */
  handleResourceDeposit(unit: Unit): void {
    const cell = this.map.getCellByPos(unit.pos);
    if (cell.isCityTile() && cell.citytile.team === unit.team) {
      const city = this.cities.get(cell.citytile.cityid);
      let fuelGained = 0;
      fuelGained +=
        unit.cargo.wood * this.configs.parameters.RESOURCE_TO_FUEL_RATE.WOOD;
      fuelGained +=
        unit.cargo.coal * this.configs.parameters.RESOURCE_TO_FUEL_RATE.COAL;
      fuelGained +=
        unit.cargo.uranium *
        this.configs.parameters.RESOURCE_TO_FUEL_RATE.URANIUM;
      city.fuel += fuelGained;

      this.stats.teamStats[unit.team].fuelGenerated += fuelGained;

      unit.cargo = {
        wood: 0,
        uranium: 0,
        coal: 0,
      };
    }
  }

  getTeamsUnits(team: Unit.TEAM): Map<string, Unit> {
    return this.state.teamStates[team].units;
  }

  getUnit(team: Unit.TEAM, unitid: string): Unit {
    return this.state.teamStates[team].units.get(unitid);
  }

  /**
   * Transfer resouces on a given team between 2 units. This does not check adjacency requirement, but its expected
   * that the 2 units are adjacent. This allows for simultaneous movement of 1 unit and transfer of another
   */
  transferResources(
    team: Unit.TEAM,
    srcID: string,
    destID: string,
    resourceType: Resource.Types,
    amount: number
  ): void {
    const srcunit = this.getUnit(team, srcID);
    const destunit = this.getUnit(team, destID);
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

  /** destroys the city with this id and remove all city tiles */
  destroyCity(cityID: string): void {
    const city = this.cities.get(cityID);
    this.cities.delete(cityID);
    city.citycells.forEach((cell) => {
      cell.citytile = null;
    });
  }

  /** destroys the unit with this id and team and removes from tile */
  destroyUnit(team: Unit.TEAM, unitid: string): void {
    const unit = this.getUnit(team, unitid);
    this.map.getCellByPos(unit.pos).units.delete(unitid);
    this.state.teamStates[team].units.delete(unitid);
  }

  /**
   * Process given move actions and returns a pruned array of actions that can all be executed with no collisions
   */
  handleMovementActions(
    actions: Array<MoveAction>,
    match: Match
  ): Array<MoveAction> {
    /**
     * Algo:
     *
     * iterate through all moves and store a mapping from cell to the actions that will cause a unit to move there
     *
     * for each cell that has multiple mapped to actions, we remove all actions as that cell is a "bump" cell
     * where no units can get there because they all bumped into each other
     *
     * for all removed actions for that particular cell, find the cell the unit that wants to execute the action is
     * currently at, labeled `origcell`. Revert these removed actions by first getting all the actions mapped from
     * `origcell` and then deleting that mapping, and then recursively reverting the actions mapped from `origcell`
     *
     */
    const cellsToActionsToThere: Map<Cell, Array<MoveAction>> = new Map();
    const movingUnits: Set<string> = new Set();

    actions.forEach((action) => {
      const newcell = action.newcell;
      const currActions = cellsToActionsToThere.get(newcell);
      if (currActions === undefined) {
        cellsToActionsToThere.set(newcell, [action]);
      } else {
        cellsToActionsToThere.set(newcell, [...currActions, action]);
      }
      movingUnits.add(action.unitid);
    });

    // reverts a given action such that cellsToActionsToThere has no collisions due to action and all related actions
    const revertAction = (action: MoveAction): void => {
      if (match) {
        match.throw(
          action.team,
          new MatchWarn(
            `Unit ${action.unitid} collided when trying to move to (${action.newcell.pos.x}, ${action.newcell.pos.y})`
          )
        );
      }
      const origcell = this.map.getCellByPos(
        this.getUnit(action.team, action.unitid).pos
      );

      // get the colliding actions caused by a revert of the given action and then delete them from the mapped origcell provided it is not a city tile
      const collidingActions = cellsToActionsToThere.get(origcell);
      if (!origcell.isCityTile()) {
        cellsToActionsToThere.delete(origcell);

        if (collidingActions) {
          // for each colliding action, revert it.
          collidingActions.forEach((collidingAction) => {
            revertAction(collidingAction);
          });
        }
      }
    };

    const actionedCells = Array.from(cellsToActionsToThere.keys());
    for (const cell of actionedCells) {
      const currActions = cellsToActionsToThere.get(cell);
      const actionsToRevert = [];
      if (currActions !== undefined) {
        if (currActions.length > 1) {
          // only revert actions that are going to the same tile that is not a city
          // if going to the same city tile, we know those actions are from same team units, and is allowed
          if (!cell.isCityTile()) {
            currActions.forEach((action) => {
              actionsToRevert.push(action);
            });
          }
        } else if (currActions.length === 1) {
          // if there is just one move action, check there isn't a unit on there that is not moving and not a city tile
          const action = currActions[0];
          if (!cell.isCityTile()) {
            if (cell.units.size === 1) {
              let unitThereIsStill = true;
              cell.units.forEach((unit) => {
                if (movingUnits.has(unit.id)) {
                  unitThereIsStill = false;
                }
              });
              if (unitThereIsStill) {
                actionsToRevert.push(action);
              }
            }
          }
        }
      }
      // if there are collisions, revert those actions and remove the mapping
      actionsToRevert.forEach((action) => {
        revertAction(action);
      });
      actionsToRevert.forEach((action) => {
        cellsToActionsToThere.delete(action.newcell);
      });
    }

    const prunedActions: Array<MoveAction> = [];
    cellsToActionsToThere.forEach((currActions) => {
      prunedActions.push(...currActions);
    });

    return prunedActions;
  }
  isNight(): boolean {
    if (this.state.turn === 0) return false;
    const dayNightTime =
      this.configs.parameters.NIGHT_LENGTH + this.configs.parameters.DAY_LENGTH;
    const mod = this.state.turn % dayNightTime;
    if (mod > this.configs.parameters.DAY_LENGTH || mod === 0) {
      return true;
    }
    return false;
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
    cityTilesBuilt: number;
    workersBuilt: number;
    cartsBuilt: number;
    roadsBuilt: number;
    roadsPillaged: number;
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
    researched: {
      [x in Resource.Types]: boolean;
    };
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
     * Formatted as `r x y`. (x,y) should be an owned city tile, the city tile is commanded to research for
     * the next X turns
     */
    RESEARCH = 'r',
    /** Formatted as `bw x y`. (x,y) should be an owned city tile, where worker is to be built */
    BUILD_WORKER = 'bw',
    /** Formatted as `bc x y`. (x,y) should be an owned city tile, where the cart is to be built */
    BUILD_CART = 'bc',
    /**
     * Formatted as `bcity unitid`. builds city at unitid's pos, unitid should be
     * friendly owned unit that is a worker
     */
    BUILD_CITY = 'bcity',
    /**
     * Formatted as `t source_unitid destination_unitid resource_type amount`. Both units in transfer should be
     * adjacent. If command valid, it will transfer as much as possible with a max of the amount specified
     */
    TRANSFER = 't',

    /** formatted as `p unitid`. Unit with the given unitid must be owned and pillages the tile they are on */
    PILLAGE = 'p',

    /** formatted as dc <x> <y> */
    DEBUG_ANNOTATE_CIRCLE = 'dc',
    /** fomatted as dx <x> <y> */
    DEBUG_ANNOTATE_X = 'dx',
    /** fomatted as dx <x1> <y1> <x2> <y2> */
    DEBUG_ANNOTATION_LINE = 'dl',
  }

  export enum DIRECTIONS {
    NORTH = 'n',
    EAST = 'e',
    SOUTH = 's',
    WEST = 'w',
    CENTER = 'c',
  }
}

/**
 * internal use only
 */
type _AccumulatedActionStats = {
  [x in Unit.TEAM]: {
    workersBuilt: number;
    cartsBuilt: number;
    actionsPlaced: Set<string>;
  };
};
