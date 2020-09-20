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
    frames: Array<{
      actions: Record<Game.ACTIONS, Array<Action>> &
        Record<
          Game.ACTIONS.MOVE,
          Array<Pick<MoveAction, 'action' | 'direction' | 'team' | 'unitid'>>
        >;
      spawnedCityTiles: Array<{
        x: number;
        y: number;
        cityid: string;
        //TODO this might not be needed;
        team: number;
      }>;
      spawnedUnits: Array<{
        type: Unit.Type;
        x: number;
        y: number;
        id: string;
        team: number;
      }>;
    }>;
  } = {
    map: [],
    allCommands: [],
    initialUnits: [],
    initialCityTiles: [],
    frames: [],
  };
  public currentFrame = -1;
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
  public initNextFrame(): void {
    this.data.frames.push({
      actions: {
        bc: [],
        bcity: [],
        bw: [],
        r: [],
        t: [],
        m: [],
        p: [],
      },
      spawnedUnits: [],
      spawnedCityTiles: [],
    });
    this.currentFrame++;
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

  public writeActions(actions: Map<Game.ACTIONS, Array<Action>>): void {
    this.data.frames[this.currentFrame].actions;
    actions.forEach((actions, key) => {
      if (key === Game.ACTIONS.MOVE) {
        this.data.frames[this.currentFrame].actions[key] = actions.map(
          (action: MoveAction) => {
            return {
              action: action.action,
              team: action.team,
              direction: action.direction,
              unitid: action.unitid,
            };
          }
        );
      } else {
        this.data.frames[this.currentFrame].actions[key] = actions;
      }
    });
  }
  public writeSpawnedObject(obj: CityTile | Unit): void {
    // if (obj instanceof CityTile) {
    //   this.data.frames[this.currentFrame].spawnedCityTiles.push({
    //     x: obj.pos.x,
    //     y: obj.pos.y,
    //     cityid: obj.cityid,
    //     team: obj.team,
    //   });
    // } else {
    //   this.data.frames[this.currentFrame].spawnedUnits.push({
    //     type: obj.type,
    //     x: obj.pos.x,
    //     y: obj.pos.y,
    //     id: obj.id,
    //     team: obj.team,
    //   });
    // }
  }
  public writeOut(): void {
    fs.appendFileSync(this.replayFilePath, JSON.stringify(this.data));
  }
}
