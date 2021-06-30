import { Game } from '.';
import { Resource } from '../Resource';
import { Unit } from '../Unit';
import { LuxMatchConfigs } from '../types';
import { GameMap } from '../GameMap';
import seedrandom from 'seedrandom';

const mapSizes = [12, 16, 24, 32]
export const generateGame = (
  matchconfigs: Partial<LuxMatchConfigs> = {}
): Game => {
  const configs = {
    ...matchconfigs,
  };
  const seed = configs.seed;
  const rng = seedrandom(`gen_${seed}`);
  if (configs.width === undefined) {
    // TODO: use rng to get width and heights
    configs.width = mapSizes[Math.floor(rng() * mapSizes.length)];
  }
  if (configs.height === undefined) {
    configs.height = mapSizes[Math.floor(rng() * mapSizes.length)];
  }
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
      [7, 8],
    ];

    for (const c of uCoords) {
      map.addResource(c[0], c[1], Resource.Types.URANIUM, 30);
      map.addResource(width - c[0] - 1, c[1], Resource.Types.URANIUM, 30);
    }

    // hardcode initial city tiles
    game.spawnCityTile(Unit.TEAM.A, 2, 1);
    game.spawnCityTile(Unit.TEAM.B, width - 3, 1);

    game.spawnWorker(Unit.TEAM.A, 2, 2);
    game.spawnWorker(Unit.TEAM.B, width - 3, 2);

    game.spawnCart(Unit.TEAM.A, 1, 2);
    game.spawnCart(Unit.TEAM.B, width - 2, 2);
  } else if (configs.mapType === GameMap.Types.EMPTY) {
    return game;
  } else {
    let symmetry = SYMMETRY.HORIZONTAL;
    let halfWidth = width;
    let halfHeight = height;
    if (rng() < 0.5) {
      symmetry = SYMMETRY.VERTICAL;
      halfWidth = width / 2;
    } else {
      halfHeight = height / 2;
    }
    let resourcesMap = generateAllResources(rng, symmetry, width, height, halfWidth, halfHeight);
    while(!validateResourcesMap(resourcesMap)) {
      resourcesMap = generateAllResources(rng, symmetry, width, height, halfWidth, halfHeight);
    }
    resourcesMap.forEach((row, y) => {
      row.forEach((val, x) => {
        if (val !== null ) {
          map.addResource(x, y, val.type, val.amt);
        }
      });
    });

    // pick random spawn location of first worker and city near a cluster of wood.
    let spawnX = Math.floor(rng() * (halfWidth - 1)) + 1;
    let spawnY = Math.floor(rng() * (halfHeight - 1)) + 1;
    while(map.getCell(spawnX, spawnY).hasResource()) {
      spawnX = Math.floor(rng() * (halfWidth - 1)) + 1;
      spawnY = Math.floor(rng() * (halfHeight - 1)) + 1;
    }
    game.spawnWorker(Unit.TEAM.A, spawnX, spawnY);
    game.spawnCityTile(Unit.TEAM.A, spawnX, spawnY);
    if (symmetry === SYMMETRY.HORIZONTAL) {
      game.spawnWorker(Unit.TEAM.B, spawnX, height - spawnY - 1);
      game.spawnCityTile(Unit.TEAM.B, spawnX, height - spawnY - 1);
    } else {
      game.spawnWorker(Unit.TEAM.B, width - spawnX - 1, spawnY);
      game.spawnCityTile(Unit.TEAM.B, width - spawnX - 1, spawnY);
    }
    // add at least 3 wood deposits near spawns
    const deltaIndex = Math.floor(rng() * MOVE_DELTAS.length)
    const woodSpawnsDeltas = [
      MOVE_DELTAS[deltaIndex],
      MOVE_DELTAS[(deltaIndex + 1) % MOVE_DELTAS.length],
      MOVE_DELTAS[(deltaIndex + 2) % MOVE_DELTAS.length]
    ];
    for (const delta of woodSpawnsDeltas) {
      const nx = spawnX + delta[0];
      const ny = spawnY + delta[1];
      let nx2 = nx;
      let ny2 = ny;
      if (symmetry === SYMMETRY.HORIZONTAL) {
        ny2 = height - ny - 1;
      }
      else {
        nx2 = width - nx - 1;
      }
      if (!map.getCell(nx, ny).hasResource()) {
        map.addResource(nx, ny, Resource.Types.WOOD, 1500);
      }
      if (!map.getCell(nx2, ny2).hasResource()) {
        map.addResource(nx2, ny2, Resource.Types.WOOD, 1500);
      }

    }

    return game;
  }

  return game;
};

enum SYMMETRY {
  HORIZONTAL,
  VERTICAL
}
const validateResourcesMap = (resourcesMap: Array<{amt: number, type: Resource.Types} | any>) => {
  const data = {"wood": 0, "coal": 0, "uranium": 0};
  resourcesMap.forEach((row, y) => {
    row.forEach((val, x) => {
      if (val !== null ) {
        data[resourcesMap[y][x].type] += resourcesMap[y][x].amt
      }
    });
  });
  if (data.wood < 15000) return false;
  if (data.coal < 4000) return false;
  if (data.uranium < 600) return false;
  return true;
}
const generateAllResources = (rng: seedrandom.prng, symmetry: SYMMETRY, width: number, height: number, halfWidth: number, halfHeight: number) => {
  const resourcesMap: Array<{amt: number, type: Resource.Types} | any> = [];
  for (let i = 0; i < height; i++) {
    resourcesMap.push([]);
    for (let j = 0; j < width; j++) {
      resourcesMap[i].push(null);
    }
  }
  const woodResourcesMap = generateResourceMap(rng, 0.21, 0.02, halfWidth, halfHeight, { deathLimit: 2, birthLimit: 4 });
  woodResourcesMap.forEach((row, y) => {
    row.forEach((val, x) => {
      if (val === 1) {
        const amt = 1250 + Math.floor(rng() * 500);
        resourcesMap[y][x] = {type:Resource.Types.WOOD, amt};
        if (symmetry === SYMMETRY.VERTICAL) {
          resourcesMap[y][width - x - 1] = {amt, type: Resource.Types.WOOD};
        } else {
          resourcesMap[height - y - 1][x] = {amt, type: Resource.Types.WOOD};
        }
      }
    });
  });
  const coalResourcesMap = generateResourceMap(rng, 0.1, 0.02, halfWidth, halfHeight, { deathLimit: 2, birthLimit: 4 });
  coalResourcesMap.forEach((row, y) => {
    row.forEach((val, x) => {
      if (val === 1) {
        const amt = 300 + Math.floor(rng() * 150);
        resourcesMap[y][x] = {type:Resource.Types.COAL, amt };
        if (symmetry === SYMMETRY.VERTICAL) {
          resourcesMap[y][width - x - 1] = {amt, type: Resource.Types.COAL};
        } else {
          resourcesMap[height - y - 1][x] = {amt, type: Resource.Types.COAL};
        }
      }
    });
  });
  const uraniumResourcesMap = generateResourceMap(rng, 0.05, 0.04, halfWidth, halfHeight, { deathLimit: 1, birthLimit: 6 });
  uraniumResourcesMap.forEach((row, y) => {
    row.forEach((val, x) => {
      if (val === 1) {
        const amt = 250 + Math.floor(rng() * 100);
        resourcesMap[y][x] = {type:Resource.Types.URANIUM, amt};
        if (symmetry === SYMMETRY.VERTICAL) {
          resourcesMap[y][width - x - 1] = {amt, type: Resource.Types.URANIUM};
        } else {
          resourcesMap[height - y - 1][x] = {amt, type: Resource.Types.URANIUM};
        }
      }
    });
  });
  return resourcesMap;
}
const generateResourceMap = (rng: seedrandom.prng, density, densityRange, width, height, golOptions: GOLOptions = { deathLimit: 2, birthLimit: 4 }): number[][] => {
  // width, height should represent half of the map
  const DENSITY = density - densityRange / 2 + densityRange * rng();
  const arr = [];
  for (let y = 0; y < height; y++) {
    arr.push([]);
    for (let x = 0; x < width; x++) {
      
      let type = 0;
      if (rng() < DENSITY) {
        type = 1;
      }
      arr[y].push(type);
    }
  }

  // simulate GOL for 2 rounds
  for (let i = 0; i < 2; i++) {
    simulateGOL(arr, golOptions);
  }
  return arr;
}

const MOVE_DELTAS = [[0, 1], [-1, 1], [-1, 0], [-1, -1], [0, -1], [1, -1], [1, 0], [1, 1]];
type GOLOptions = {
  deathLimit: number;
  birthLimit: number;
};

const simulateGOL = (arr: Array<Array<number>>, options: GOLOptions) => {
  // low deathlimit, high birthlimit -> more nois looking
  const padding = 1;
  const deathLimit = options.deathLimit;
  const birthLimit = options.birthLimit;
  for (let i = padding; i < arr.length - padding; i++) {
    for (let j = padding; j < arr[0].length - padding; j++) {
      let alive = 0;
      for (let k = 0; k < MOVE_DELTAS.length; k++) {
        const delta = MOVE_DELTAS[k];
        const ny= i + delta[1];
        const nx =j + delta[0];
        if (arr[ny][nx] === 1) {
          alive++;
        }
      }
      if (arr[i][j] == 1) {
        if (alive < deathLimit) {
            arr[i][j] = 0;
        }
        else {
            arr[i][j] = 1;
        }
      }
      else {
        if (alive > birthLimit) {
            arr[i][j] = 1;
        }
        else {
            arr[i][j] = 0;
        }
      }
    }
  }
}

export interface GenerationConfigs {
  width: number;
  height: number;
  seed: number;
}
