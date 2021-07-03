import {GAME_CONSTANTS} from "./game_constants";
import {City} from "./City";
import {Unit} from "./Unit";

/**
 * holds all data related to a player
 */
export class Player {
  public readonly team: number;
  public researchPoints: number;
  public units: Array<Unit>;
  public cities: Map<string, City>;
  public cityTileCount: number;

  public constructor(teamid: number) {
    this.team = teamid;
    this.researchPoints = 0;
    // map unit id to the unit
    this.units = [];
    this.cities = new Map();
    this.cityTileCount = 0;
  }

  public researchedCoal(): boolean {
    return this.researchPoints >= GAME_CONSTANTS.PARAMETERS.RESEARCH_REQUIREMENTS.COAL;
  }

  public researchedUranium(): boolean {
    return this.researchPoints >= GAME_CONSTANTS.PARAMETERS.RESEARCH_REQUIREMENTS.URANIUM;
  }
}