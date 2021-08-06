import { SerializedState } from "../types";
import { Unit } from "../Unit";
import { Parser } from "./parsed";
import GAME_CONSTANTS from '../game_constants.json';
/** all constants related to any input from match engine */
export const INPUT_CONSTANTS = {
  DONE: 'D_DONE',
  RESEARCH_POINTS: 'rp',
  RESOURCES: 'r',
  UNITS: 'u',
  CITY: 'c',
  CITY_TILES: 'ct',
  ROADS: 'ccd'
};
export type KaggleObservation = {
  turn: number;
  updates: Array<string>;
  width: number;
  height: number;
  globalCityIDCount: number;
  globalUnitIDCount: number;
  // there's more but this is all we need
}
export const parseKaggleObs = (obs: KaggleObservation): SerializedState => {
  const parse = new Parser(' ');
  const turn = obs.turn; // find this in observation json
  const researchPoints = [0, 0];
  const map: SerializedState["map"] = [];
  for (let y = 0; y < obs.height; y++) {
    map.push([]);
    for (let x = 0; x < obs.width; x++) {
      map[y].push({
        road: 0,
      })
    }
  }
  const teamUnits: SerializedState["teamStates"]["0"]["units"][] = [{}, {}];
  const cities: SerializedState["cities"] = {};
  // NOTE, globalCityIDCount and globalUnitIDCount are not in the observations, but not required to work
  // Just means unit ids and city ids won't match up if you replay from a certain step

  for (const _update of obs.updates) {
    const update = parse.parse(_update);
    if (update.str === INPUT_CONSTANTS.DONE) {
      break;
    }
    const inputIdentifier = update.nextStr();
    switch (inputIdentifier) {
      case INPUT_CONSTANTS.RESEARCH_POINTS: {
        const team = update.nextInt();
        researchPoints[team] = update.nextInt();
        break;
      }
      case INPUT_CONSTANTS.RESOURCES: {
        const type = update.nextStr();
        const x = update.nextInt();
        const y = update.nextInt();
        const amt = update.nextInt();
        // this.gameState.map._setResource(type, x, y, amt);
        map[y][x].resource = {type, amount: amt}
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
        teamUnits[team][unitid] = {
          cargo: {
            wood,
            coal,
            uranium,
          },
          x,y,cooldown, type: unittype
        }
        break;
      }
      case INPUT_CONSTANTS.CITY: {
        const team = update.nextInt();
        const cityid = update.nextStr();
        const fuel = update.nextFloat();
        const lightupkeep = update.nextFloat();
        // this.gameState.players[team].cities.set(cityid, new City(team, cityid, fuel, lightUpkeep));
        cities[cityid] = {
          team,
          fuel,
          cityCells: [],
          id: cityid,
          lightupkeep,
        }
        break;
      }
      case INPUT_CONSTANTS.CITY_TILES: {
        const team = update.nextInt();
        const cityid = update.nextStr();
        const x = update.nextInt();
        const y = update.nextInt();
        const cooldown = update.nextFloat();
        const city = cities[cityid];//this.gameState.players[team].cities.get(cityid);
        // const citytile = city.addCityTile(x, y, cooldown);
        // this.gameState.map.getCell(x, y).citytile = citytile;
        // this.gameState.players[team].cityTileCount += 1;
        city.cityCells.push({x, y, cooldown});
        break;
      }
      case INPUT_CONSTANTS.ROADS: {
        const x = update.nextInt();
        const y = update.nextInt();
        const road = update.nextFloat();
        // this.gameState.map.getCell(x, y).road = road;
        map[y][x].road = road;
        break;
      }
    }
  }
  return {
    map,
    cities,
    globalCityIDCount: obs.globalCityIDCount,
    globalUnitIDCount: obs.globalUnitIDCount,
    turn,
    teamStates: {
      [Unit.TEAM.A]: {
        researchPoints: researchPoints[0],
        units: teamUnits[0],
        researched: {
          "wood": true,
          "coal": researchPoints[0] >= GAME_CONSTANTS["PARAMETERS"]["RESEARCH_REQUIREMENTS"]["COAL"],
          "uranium": researchPoints[0] >= GAME_CONSTANTS["PARAMETERS"]["RESEARCH_REQUIREMENTS"]["URANIUM"]
        }
      },
      [Unit.TEAM.B]: {
        researchPoints: researchPoints[1],
        units: teamUnits[1],
        researched: {
          "wood": true,
          "coal": researchPoints[1] >= GAME_CONSTANTS["PARAMETERS"]["RESEARCH_REQUIREMENTS"]["COAL"],
          "uranium": researchPoints[1] >= GAME_CONSTANTS["PARAMETERS"]["RESEARCH_REQUIREMENTS"]["URANIUM"]
        }
      }
    }
  }
}