import { Game } from '.';
import { Resource } from '../Resource';
import { Unit } from '../Unit';
import { LuxMatchConfigs } from '../types';

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

  // for testing, hardcode wood and coal
  map.addResource(3, 3, Resource.Types.WOOD, 1000);
  map.addResource(3, 4, Resource.Types.WOOD, 1000);
  map.addResource(4, 3, Resource.Types.WOOD, 1000);
  map.addResource(12, 3, Resource.Types.WOOD, 1000);
  map.addResource(12, 4, Resource.Types.WOOD, 1000);
  map.addResource(11, 3, Resource.Types.WOOD, 1000);
  map.addResource(12, 12, Resource.Types.WOOD, 1000);
  map.addResource(3, 12, Resource.Types.WOOD, 1000);

  map.addResource(5, 5, Resource.Types.COAL, 200);
  map.addResource(10, 5, Resource.Types.COAL, 200);
  map.addResource(7, 8, Resource.Types.URANIUM, 20);
  map.addResource(8, 8, Resource.Types.URANIUM, 20);

  // hardcode initial city tiles
  game.spawnCityTile(Unit.TEAM.A, 1, 1);
  game.spawnCityTile(Unit.TEAM.B, 14, 1);

  game.spawnWorker(Unit.TEAM.A, 2, 2);
  game.spawnWorker(Unit.TEAM.B, 13, 2);

  game.spawnCart(Unit.TEAM.A, 3, 2);
  game.spawnCart(Unit.TEAM.B, 12, 2);

  return game;
};

export interface GenerationConfigs {
  width: number;
  height: number;
  seed: number;
}
