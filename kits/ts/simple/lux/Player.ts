import GAME_CONSTANTS from "./game_constants.json";
import {City} from "./City";
import {Unit} from "./Unit";

/**
 * holds all data related to a player
 */
export class Player {
  public readonly team: number;
  public researchPoints = 0;
  // Map unit id to the unit
  public units = new Array<Unit>();
  public cities = new Map<string, City>();
  public cityTileCount = 0;

  public constructor(teamid: number) {
    this.team = teamid;
  }

  public researchedCoal(): boolean {
    return this.researchPoints >= GAME_CONSTANTS.PARAMETERS.RESEARCH_REQUIREMENTS.COAL;
  }

  public researchedUranium(): boolean {
    return this.researchPoints >= GAME_CONSTANTS.PARAMETERS.RESEARCH_REQUIREMENTS.URANIUM;
  }
}