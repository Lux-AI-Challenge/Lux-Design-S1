import { GameMap } from '.';
import { Resource } from '../Resource';
import { Unit } from '../Unit';

const defaultGenerationConfigs = {
  width: 16,
  height: 16,
  seed: 0,
};
export const generateMap = (
  mapconfigs: Partial<GenerationConfigs> = {}
): GameMap => {
  const configs = {
    ...defaultGenerationConfigs,
    ...mapconfigs,
  };
  const map = new GameMap(configs.width, configs.height);

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
  map.spawnCityTile(Unit.TEAM.A, 1, 1);
  map.spawnCityTile(Unit.TEAM.B, 14, 1);

  return map;
};

export interface GenerationConfigs {
  width: number;
  height: number;
  seed: number;
}
