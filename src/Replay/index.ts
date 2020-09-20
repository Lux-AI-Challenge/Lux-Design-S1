import { Match, MatchEngine } from 'dimensions-ai';
import fs from 'fs';
import path from 'path';
import { Action, MoveAction } from '../Actions';
import { Game } from '../Game';
import { CityTile } from '../Game/city';
import { GameMap } from '../GameMap';
import { Resource } from '../Resource';
import { Unit } from '../Unit';

export class Replay {
  public replayFilePath: string = null;
  public data: {
    map: Array<
      Array<{
        resource: Resource.Types | null;
        amt: number;
      }>
    >;
    initialUnits: Array<{
      type: Unit.Type;
      id: string;
      x: number;
      y: number;
      team: number;
    }>;
    initialCityTiles: Array<{
      cityid: string;
      x: number;
      y: number;
      team: number;
    }>;
    allCommands: Array<Array<MatchEngine.Command>>;
  } = {
    map: [],
    allCommands: [],
    initialUnits: [],
    initialCityTiles: [],
  };
  constructor(match: Match) {
    const d = new Date().valueOf();
    const replayFileName = `${d}_${match.id}.luxr`;
    this.replayFilePath = path.join(
      match.configs.storeReplayDirectory,
      replayFileName
    );
    if (!fs.existsSync(match.configs.storeReplayDirectory)) {
      fs.mkdirSync(match.configs.storeReplayDirectory, { recursive: true });
    }
    fs.writeFileSync(this.replayFilePath, '');
  }
  public writeMap(gameMap: GameMap): void {
    for (let y = 0; y < gameMap.width; y++) {
      this.data.map.push(
        gameMap.getRow(y).map((cell) => {
          if (cell.resource) {
            return {
              resource: cell.resource.type,
              amt: cell.resource.amount,
            };
          } else {
            return {
              resource: null,
              amt: 0,
            };
          }
        })
      );
    }
  }

  public writeInitialUnits(game: Game): void {
    game.getTeamsUnits(Unit.TEAM.A).forEach((unit) => {
      this.data.initialUnits.push({
        id: unit.id,
        x: unit.pos.x,
        y: unit.pos.y,
        team: unit.team,
        type: unit.type,
      });
    });
    game.getTeamsUnits(Unit.TEAM.B).forEach((unit) => {
      this.data.initialUnits.push({
        id: unit.id,
        x: unit.pos.x,
        y: unit.pos.y,
        team: unit.team,
        type: unit.type,
      });
    });
    game.cities.forEach((city) => {
      city.citycells.forEach((cell) => {
        const ct = cell.citytile;
        this.data.initialCityTiles.push({
          cityid: ct.cityid,
          team: ct.team,
          x: ct.pos.x,
          y: ct.pos.y,
        });
      });
    });
  }
  public writeOut(): void {
    fs.appendFileSync(this.replayFilePath, JSON.stringify(this.data));
  }
}
