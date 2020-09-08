const fs = require('fs');
const readline = require('readline');

// Create parser and use ',' as the delimiter between commands being sent by the `Match` and `MatchEngine`
const Parser = require('./parser');
const {
  GameMap
} = require('./map');
const {
  INPUT_CONSTANTS
} = require('./io');
const {
  Player,
  City,
  Unit,
} = require('./game_objects');
const GAME_CONSTANTS = require('./game_constants');
const parse = new Parser(' ');

/**
 * Agent for sequential `Designs`
 */
class Agent {
  _setup() {

    // Prepare to read input
    const rl = readline.createInterface({
      input: process.stdin,
      output: null,
    });

    let buffer = [];
    let currentResolve;
    const makePromise = function () {
      return new Promise((resolve) => {
        currentResolve = resolve;
      });
    };
    // on each line, push line to buffer
    rl.on('line', (line) => {
      buffer.push(line);
      currentResolve();
      currentPromise = makePromise();
    });

    // The current promise for retrieving the next line
    let currentPromise = makePromise();

    // with await, we pause process until there is input
    const getLine = async () => {
      return new Promise(async (resolve) => {
        while (buffer.length === 0) {
          // pause while buffer is empty, continue if new line read
          await currentPromise;
        }
        // once buffer is not empty, resolve the most recent line in stdin, and remove it
        resolve(parse(buffer.shift()));
      });
    };
    this.getLine = getLine;
  }

  /**
   * Constructor for a new agent
   * User should edit this according to the `Design` this agent will compete under
   */
  constructor() {
    this._setup(); // DO NOT REMOVE
  }

  /**
   * Initialize Agent for the `Match`
   * User should edit this according to their `Design`
   */
  async initialize() {

    // get agent ID
    this.id = (await this.getLine()).nextInt();
    this.turn = 0;
    // get some other necessary initial input
    let mapInfo = (await this.getLine());
    let width = mapInfo.nextInt();
    let height = mapInfo.nextInt();
    this.mapWidth = width;
    this.mapHeight = height;
    this.map = new GameMap(width, height);
    this.players = [new Player(0), new Player(1)];
    await this.retrieveUpdates();
  }
  /**
   * Updates agent's own known state of `Match`
   * User should edit this according to their `Design`.
   */
  async update() {
    this.turn++;
    // wait for the engine to send any updates
    await this.retrieveUpdates();
  }

  resetPlayerStates() {
    this.players[0].units = [];
    this.players[0].cities = new Map();
    this.players[1].units = [];
    this.players[1].cities = new Map();
  }
  async retrieveUpdates() {
    this.resetPlayerStates();
    // TODO: this can be optimized. we only reset because some resources get removed
    this.map = new GameMap(this.mapWidth, this.mapHeight);
    while (true) {
      let update = (await this.getLine());
      if (update.str === INPUT_CONSTANTS.DONE) {
        break;
      }
      const inputIdentifier = update.nextStr();
      switch (inputIdentifier) {
        case INPUT_CONSTANTS.RESEARCH_POINTS: {
          const team = update.nextInt();
          this.players[team].researchPoints = update.nextInt();
          break;
        }
        case INPUT_CONSTANTS.RESOURCES: {
          const type = update.nextStr();
          const x = update.nextInt();
          const y = update.nextInt();
          const amt = update.nextInt();
          this.map._setResource(type, x, y, amt);
          break;
        }
        case INPUT_CONSTANTS.UNITS: {
          const unittype = update.nextInt();
          const team = update.nextInt();
          const unitid = update.nextStr();
          const x = update.nextInt();
          const y = update.nextInt();
          const cooldown = update.nextInt();
          const wood = update.nextInt();
          const coal = update.nextInt();
          const uranium = update.nextInt();
          this.players[team].units.push(new Unit(team, unittype, unitid, x, y, cooldown, wood, coal, uranium));
          break;
        }
        case INPUT_CONSTANTS.CITY: {
          const team = update.nextInt();
          const cityid = update.nextStr();
          const fuel = update.nextInt();
          const lightUpkeep = update.nextInt();
          this.players[team].cities.set(cityid, new City(team, cityid, fuel, lightUpkeep));
          break;
        }
        case INPUT_CONSTANTS.CITY_TILES: {
          const team = update.nextInt();
          const cityid = update.nextStr();
          const x = update.nextInt();
          const y = update.nextInt();
          const cooldown = update.nextInt();
          const city = this.players[team].cities.get(cityid);
          const citytile = city.addCityTile(x, y, cooldown);
          this.map.getCell(x, y).citytile = citytile;
          break;
        }
      }
    }
  }

  /**
   * End a turn
   */
  endTurn() {
    console.log('D_FINISH');
  }
}

module.exports = {
  Agent
};