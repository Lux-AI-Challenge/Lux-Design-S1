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
    this.units = {};
    this.cities = {};
  }
}

// all data related to a city
class City {
  constructor(teamid, cityid, fuel) {
    this.cityid = cityid;
    this.team = teamid;
    this.fuel = fuel;
    this.citytiles = [];
  }
  addCityTile(x, y, cooldown) {
    this.citytiles.push(new CityTile(this.team, this.cityid, x, y, cooldown))
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
}

class Unit {
  constructor(teamid, type, x, y, cooldown, wood, coal, uranium) {
    this.pos = new Position(x, y);
    this.team = teamid;
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
  canMove() {
    return this.cooldown === 0;
  }
}

module.exports = {
  Player,
  City,
  Unit,
  CityTile,
}