import readline from "readline";
import {Player} from "./Player";
import {GameMap} from "./GameMap";
import {City} from "./City";
import {Unit} from "./Unit";
import {Parser} from "./Parser";
import {Parsed} from "./Parsed";
import {INPUT_CONSTANTS} from './io';

// Create parser and use ',' as the delimiter between commands being sent by the `Match` and `MatchEngine`
const parse = new Parser(' ');

export interface GameState {
  id: number;
  map: GameMap;
  players: Array<Player>;
  turn: number;
}

/**
 * Agent for sequential `Designs`
 */
export class Agent {
  public getLine: () => Promise<Parsed>;
  public gameState: GameState;
  public _setup(): void {

    // Prepare to read input
    const rl = readline.createInterface({
      input: process.stdin,
      output: null,
    });

    const buffer = [];
    let currentResolve: () => void;
    let currentPromise;
    const makePromise = function () {
      return new Promise<void>((resolve) => {
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
    currentPromise = makePromise()


    // with await, we pause process until there is input
    this.getLine = async () => {
      return new Promise(async (resolve) => {
        while (buffer.length === 0) {
          // pause while buffer is empty, continue if new line read
          await currentPromise;
        }
        // once buffer is not empty, resolve the most recent line in stdin, and remove it
        resolve((parse as any)(buffer.shift()));
      });
    };
  }

  /**
   * Constructor for a new agent
   * User should edit this according to the `Design` this agent will compete under
   */
  public constructor() {
    this._setup(); // DO NOT REMOVE
  }

  /**
   * Initialize Agent for the `Match`
   * User should edit this according to their `Design`
   */
  public async initialize() {

    // get agent ID
    const id = (await this.getLine()).nextInt();
    // get some other necessary initial input
    let mapInfo = (await this.getLine());
    let width = mapInfo.nextInt();
    let height = mapInfo.nextInt();
    const map = new GameMap(width, height);
    const players = [new Player(0), new Player(1)];

    this.gameState = {
      id,
      map,
      players,
      turn: -1,
    };
  }
  /**
   * Updates agent's own known state of `Match`
   * User should edit this according to their `Design`.
   */
  public async update() {
    this.gameState.turn++;
    // wait for the engine to send any updates
    await this.retrieveUpdates();
  }

  public resetPlayerStates() {
    const players = this.gameState.players;
    players[0].units = [];
    players[0].cities = new Map();
    players[0].cityTileCount = 0;
    players[1].units = [];
    players[1].cities = new Map();
    players[1].cityTileCount = 0;
  }
  public async retrieveUpdates() {
    this.resetPlayerStates();
    // TODO: this can be optimized. we only reset because some resources get removed
    this.gameState.map = new GameMap(this.gameState.map.width, this.gameState.map.height);
    while (true) {
      let update = (await this.getLine());
      if (update.str === INPUT_CONSTANTS.DONE) {
        break;
      }
      const inputIdentifier = update.nextStr();
      switch (inputIdentifier) {
        case INPUT_CONSTANTS.RESEARCH_POINTS: {
          const team = update.nextInt();
          this.gameState.players[team].researchPoints = update.nextInt();
          break;
        }
        case INPUT_CONSTANTS.RESOURCES: {
          const type = update.nextStr();
          const x = update.nextInt();
          const y = update.nextInt();
          const amt = update.nextInt();
          this.gameState.map._setResource(type, x, y, amt);
          break;
        }
        case INPUT_CONSTANTS.UNITS: {
          const unittype = update.nextInt();
          const team = update.nextInt();
          const unitid = update.nextStr();
          const x = update.nextInt();
          const y = update.nextInt();
          const cooldown = update.nextFloat();
          const wood = update.nextInt();
          const coal = update.nextInt();
          const uranium = update.nextInt();
          this.gameState.players[team].units.push(new Unit(team, unittype, unitid, x, y, cooldown, wood, coal, uranium));
          break;
        }
        case INPUT_CONSTANTS.CITY: {
          const team = update.nextInt();
          const cityid = update.nextStr();
          const fuel = update.nextFloat();
          const lightUpkeep = update.nextFloat();
          this.gameState.players[team].cities.set(cityid, new City(team, cityid, fuel, lightUpkeep));
          break;
        }
        case INPUT_CONSTANTS.CITY_TILES: {
          const team = update.nextInt();
          const cityid = update.nextStr();
          const x = update.nextInt();
          const y = update.nextInt();
          const cooldown = update.nextFloat();
          const city = this.gameState.players[team].cities.get(cityid);
          const citytile = city.addCityTile(x, y, cooldown);
          this.gameState.map.getCell(x, y).citytile = citytile;
          this.gameState.players[team].cityTileCount += 1;
          break;
        }
        case INPUT_CONSTANTS.ROADS: {
          const x = update.nextInt();
          const y = update.nextInt();
          const road = update.nextFloat();
          this.gameState.map.getCell(x, y).road = road;
          break;
        }
      }
    }
  }

  /**
   * End a turn
   */
  public endTurn(): void {
    console.log('D_FINISH');
  }

  public async run(loop: (gameState: GameState) => Array<string>): Promise<void> {
    await this.initialize();
    while (true) {
      await this.update();
      try {
        const actions = loop(this.gameState);
        console.log(actions.join(","));
      } catch (err) {
        console.log(err);
      }
      this.endTurn();
    }
  }
}

export const annotate = {
  circle: (x: number, y: number): string => {
    return `dc ${x} ${y}`
  },
  x: (x: number, y: number): string => {
    return `dx ${x} ${y}`
  },
  line: (x1: number, y1: number, x2: number, y2: number): string => {
    return `dl ${x1} ${y1} ${x2} ${y2}`
  },
  text: (x1: number, y1: number, message: string, fontsize: number = 16) => {
    return `dt ${x1} ${y1} '${message}' ${fontsize}`
  },
  sidetext: (message: string) => {
    return `dst '${message}'`
  }
}
