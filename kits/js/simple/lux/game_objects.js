/**
 * All game objects for access by user
 */
const {
  Position
} = require("./map");
const GAME_CONSTANTS = require("./game_constants");

/**
 * holds all data related to a player
 */
class Player {
  constructor(teamid) {
    this.team = teamid;
    this.researchPoints = 0;
    // map unit id to the unit
    this.units = [];
    this.cities = new Map();
    this.cityTileCount = 0;
  }
  researchedCoal() {
    return this.researchPoints >= GAME_CONSTANTS.PARAMETERS.RESEARCH_REQUIREMENTS.COAL;
  }
  researchedUranium() {
    return this.researchPoints >= GAME_CONSTANTS.PARAMETERS.RESEARCH_REQUIREMENTS.URANIUM;
  }
}

// all data related to a city
class City {
  constructor(teamid, cityid, fuel, lightUpkeep) {
    this.cityid = cityid;
    this.team = teamid;
    this.fuel = fuel;
    this.citytiles = [];
    this.lightUpkeep = lightUpkeep;
  }
  addCityTile(x, y, cooldown) {
    const ct = new CityTile(this.team, this.cityid, x, y, cooldown)
    this.citytiles.push(ct);
    return ct;
  }
  getLightUpkeep() {
    return this.lightUpkeep;
  }
}

/** CityTile and Unit are both actionable and can return action strings to send to engine  */
class CityTile {
  constructor(teamid, cityid, x, y, cooldown) {
    this.cityid = cityid;
    this.team = teamid;
    this.pos = new Position(x, y);
    this.cooldown = cooldown;
  }
  /** Whether or not this unit can research or build */
  canAct() {
    return this.cooldown < 1;
  }
  /** returns command to ask this tile to research this turn */
  research() {
    return `r ${this.pos.x} ${this.pos.y}`;
  }
  /** returns command to ask this tile to build a worker this turn */
  buildWorker() {
    return `bw ${this.pos.x} ${this.pos.y}`;
  }
  /** returns command to ask this tile to build a cart this turn */
  buildCart() {
    return `bc ${this.pos.x} ${this.pos.y}`;
  }
}

class Unit {
  constructor(teamid, type, unitid, x, y, cooldown, wood, coal, uranium) {
    this.pos = new Position(x, y);
    this.team = teamid;
    this.id = unitid;
    this.type = type;
    this.cooldown = cooldown;
    this.cargo = {
      wood,
      coal,
      uranium
    }
  }
  isWorker() {
    return this.type === GAME_CONSTANTS.UNIT_TYPES.WORKER;
  }

  isCart() {
    return this.type === GAME_CONSTANTS.UNIT_TYPES.CART;
  }

  getCargoSpaceLeft() {
    const spaceused = this.cargo.wood + this.cargo.coal + this.cargo.uranium;
    if (this.type === GAME_CONSTANTS.UNIT_TYPES.WORKER) {
      return GAME_CONSTANTS.PARAMETERS.RESOURCE_CAPACITY.WORKER - spaceused;
    } else {
      return GAME_CONSTANTS.PARAMETERS.RESOURCE_CAPACITY.CART - spaceused;
    }
  }

  /** whether or not the unit can build where it is right now */
  canBuild(gameMap) {
    let cell = gameMap.getCellByPos(this.pos);
    if (!cell.hasResource() && this.canAct() && (this.cargo.wood + this.cargo.coal + this.cargo.uranium) >= GAME_CONSTANTS.PARAMETERS.CITY_BUILD_COST) {
      return true;
    }
    return false;
  }

  /** whether or not the unit can act or not. This does not check for potential collisions into other units or enemy cities */
  canAct() {
    return this.cooldown < 1;
  }

  /** return the command to move unit in the given direction */
  move(dir) {
    return `m ${this.id} ${dir}`;
  }

  /** return the command to transfer a resource from a source unit to a destination unit as specified by their ids or the units themselves */
  transfer(destUnit, resourceType, amount) {
    let destID = typeof destUnit === "string" ? destUnit : destUnit.id;
    return `t ${this.id} ${destID} ${resourceType} ${amount}`;
  }

  /** return the command to build a city right under the worker */
  buildCity() {
    return `bcity ${this.id}`;
  }

  /** return the command to pillage whatever is underneath the worker */
  pillage() {
    return `p ${this.id}`;
  }
}

module.exports = {
  Player,
  City,
  Unit,
  CityTile,
}
