import { Game } from '.';
import { Resource } from '../Resource';
import { Unit } from '../Unit';
import { LuxMatchConfigs } from '../types';
import { GameMap } from '../GameMap';

const defaultGenerationConfigs = {
  width: 16,
  height: 16,
  seed: 0,
};
export const generateGame = (
  matchconfigs: Partial<LuxMatchConfigs> = {}
): Game => {
  const configs = {
    ...defaultGenerationConfigs,
    ...matchconfigs,
  };
  const game = new Game(configs);
  const map = game.map;
  const width = map.width;
  const height = map.height;
  if (configs.mapType === GameMap.Types.DEBUG) {
    // for testing, hardcode wood and coal
    const woodCoords = [
      [3, 3],
      [3, 4],
      [4, 3],
      [5, 6],
      [1, 1],
      [1, 2],
      [1, 3],
      [2, 5],
      [2, 14],
      [2, 13],
      [4, 13],
      [5, 13],
      [5, 12],
      [5, 14],
    ];

    for (const c of woodCoords) {
      map.addResource(c[0], c[1], Resource.Types.WOOD, 1500);
      map.addResource(width - c[0] - 1, c[1], Resource.Types.WOOD, 1500);
    }

    const coalCoords = [
      [5, 5],
      [6, 5],
      [9, 4],
    ];

    for (const c of coalCoords) {
      map.addResource(c[0], c[1], Resource.Types.COAL, 300);
      map.addResource(width - c[0] - 1, c[1], Resource.Types.COAL, 300);
    }

    const uCoords = [
      [9, 7],
      [8, 8],
      [7, 8],
    ];

    for (const c of uCoords) {
      map.addResource(c[0], c[1], Resource.Types.URANIUM, 30);
      map.addResource(width - c[0] - 1, c[1], Resource.Types.URANIUM, 30);
    }

    map.addResource(7, 8, Resource.Types.URANIUM, 20);
    map.addResource(8, 8, Resource.Types.URANIUM, 20);

    // hardcode initial city tiles
    game.spawnCityTile(Unit.TEAM.A, 2, 1);
    game.spawnCityTile(Unit.TEAM.B, width - 2, 1);

    game.spawnWorker(Unit.TEAM.A, 2, 2);
    game.spawnWorker(Unit.TEAM.B, width - 2, 2);

    game.spawnCart(Unit.TEAM.A, 1, 2);
    game.spawnCart(Unit.TEAM.B, width - 1, 2);
  }

  return game;
};

export interface GenerationConfigs {
  width: number;
  height: number;
  seed: number;
}
