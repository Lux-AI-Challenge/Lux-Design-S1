import { Game } from '.';
import { Resource } from '../Resource';
import { Unit } from '../Unit';

const defaultGenerationConfigs = {
  width: 16,
  height: 16,
  seed: 0,
};
export const generateGame = (
  mapconfigs: Partial<GenerationConfigs> = {}
): Game => {
  const configs = {
    ...defaultGenerationConfigs,
    ...mapconfigs,
  };
  const game = new Game({
    width: configs.width,
    height: configs.height,
  });
  const map = game.map;

  // for testing, hardcode wood and coal
  map.getCell(3, 3).setResource(Resource.Types.WOOD, 1000);
  map.getCell(3, 4).setResource(Resource.Types.WOOD, 1000);
  map.getCell(4, 3).setResource(Resource.Types.WOOD, 1000);
  map.getCell(12, 3).setResource(Resource.Types.WOOD, 1000);
  map.getCell(12, 4).setResource(Resource.Types.WOOD, 1000);
  map.getCell(11, 3).setResource(Resource.Types.WOOD, 1000);
  map.getCell(12, 12).setResource(Resource.Types.WOOD, 1000);
  map.getCell(12, 3).setResource(Resource.Types.WOOD, 1000);
  map.getCell(3, 12).setResource(Resource.Types.WOOD, 1000);

  map.getCell(5, 5).setResource(Resource.Types.COAL, 1000);
  map.getCell(10, 5).setResource(Resource.Types.COAL, 1000);

  map.getCell(7, 8).setResource(Resource.Types.URANIUM, 1000);
  map.getCell(8, 8).setResource(Resource.Types.URANIUM, 1000);

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
