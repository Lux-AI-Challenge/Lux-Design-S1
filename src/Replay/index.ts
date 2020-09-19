import { Match } from 'dimensions-ai';
import fs from 'fs';
import path from 'path';
import { isMainThread } from 'worker_threads';
import { Action } from '../Actions';
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
    frames: Array<{
      actions: Record<Game.ACTIONS, Array<Action>>;
      spawnedObjects: Array<{
        // 2 means city tile
        type: 2 | Unit.Type;
        //
        x: number;
        y: number;
      }>;
    }>;
  } = {
    map: [],
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
      spawnedObjects: [],
    });
    this.currentFrame++;
  }
  public writeActions(actions: Map<Game.ACTIONS, Array<Action>>): void {
    this.data.frames[this.currentFrame].actions;
    actions.forEach((actions, key) => {
      this.data.frames[this.currentFrame].actions[key] = actions;
    });
  }
  public writeSpawnedObject(obj: CityTile | Unit): void {
    let type: Unit.Type | 2 = 0;
    if (obj instanceof CityTile) {
      type = 2;
    } else {
      type = obj.type;
    }
    this.data.frames[this.currentFrame].spawnedObjects.push({
      type,
      x: obj.pos.x,
      y: obj.pos.y,
    });
  }
  public writeOut(): void {
    fs.appendFileSync(this.replayFilePath, JSON.stringify(this.data));
  }
}
