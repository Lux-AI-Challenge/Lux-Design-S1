import fs from 'fs';
import { create, Logger } from 'dimensions-ai';
import {
  Game,
  LuxDesign,
  LuxMatchState,
  Position,
} from '../src';
const design = new LuxDesign('Lux Design');
const luxdim = create(design, {
  name: 'luxdimension',
  id: 'luxdim',
  defaultMatchConfigs: {},
  loggingLevel: Logger.LEVEL.NONE,
  secureMode: false,
  observe: false,
  activateStation: false,
});
const options = {
  storeErrorLogs: false,
  storeReplay: false,
  compressReplay: false,
  seed: 0,
  debug: false,
  debugAnnotations: true,
  loggingLevel: Logger.LEVEL.NONE,
  mapType: 'random',
  detached: true,
  agentOptions: { detached: true },
  engineOptions: {
    noStdErr: false,
    timeout: {
      active: true,
      max: 2000,
    },
  },
};
const stats = {};

const dist = (pos1: Position, pos2: Position) => {
  return Math.abs(pos1.x - pos2.x) + Math.abs(pos1.y - pos2.y);
};
const resourcesNear = (game: Game, pos: Position) => {
  const queue = [pos];
  const visited: Set<number> = new Set();
  const resources: Record<
    number,
    {
      wood: number;
      coal: number;
      uranium: number;
      woodTiles: number;
      coalTiles: number;
      uraniumTiles: number;
    }
  > = {}; // map distance to counts.
  while (queue.length > 0) {
    const check = queue.shift();
    if (!game.map.inMap(check)) continue;
    if (visited.has(check.x + check.y * 10000)) continue;
    visited.add(check.x + check.y * 10000);
    const d = dist(check, pos);
    if (d > 24) continue;
    
    const cell = game.map.getCellByPos(check);
    if (resources[d] === undefined) {
      if (d == 0) {
        resources[d] = {
          wood: 0,
          coal: 0,
          uranium: 0,
          woodTiles: 0,
          coalTiles: 0,
          uraniumTiles: 0,
        };
      } else {
        resources[d] = {...resources[d - 1]}
      }
    }
    if (cell.hasResource()) {
      resources[d][cell.resource.type] += cell.resource.amount;
      resources[d][`${cell.resource.type}Tiles`] += 1;
    }
    queue.push(
      ...[
        check.translate(Game.DIRECTIONS.NORTH, 1),
        check.translate(Game.DIRECTIONS.WEST, 1),
        check.translate(Game.DIRECTIONS.EAST, 1),
        check.translate(Game.DIRECTIONS.SOUTH, 1),
      ]
    );
  }
  return resources;
};

const run = async (times = 10000) => {
  const stime = new Date();
  for (let i = 0; i < times; i++) {
    // console.log(i);
    options.seed = 10000 + i;
    // console.log("Gen", i)
    const match = await luxdim.createMatch(['temp', 'temp'], options);
    const state: LuxMatchState = match.state;
    const resources = {
      wood: 0,
      coal: 0,
      uranium: 0,
      woodTiles: 0,
      coalTiles: 0,
      uraniumTiles: 0,
    };
    const rvals = [];
    const key = state.game.map.height;
    for (let y = 0; y < state.game.map.height; y++) {
      for (let x = 0; x < state.game.map.width; x++) {
        const cell = state.game.map.getCell(x, y);
        if (cell.hasResource()) {
          resources[cell.resource.type] += cell.resource.amount;
          resources[`${cell.resource.type}Tiles`] += 1;
        }
        if (cell.isCityTile()) {
          // find start locations and how many resources are within various radius
          rvals.push(resourcesNear(match.state.game, cell.pos));
        }
      }
    }
   
    if (stats[key] !== undefined) {
      stats[key].resources.push(resources);
      stats[key].count += 1;
      stats[key].resourceprox.push(rvals);
    } else {
      stats[key] = { resources: [resources], count: 1, resourceprox: [rvals] };
    }
  }
  // for (const k in stats) {
  //   for
  //   for (const rt in stats[k]) {
  //     if (rt != 'count'){
  //       stats[k][rt] /= stats[k]['count']
  //     }
  //   }
  // }
  const etime = new Date();
  const dt = etime.getTime() - stime.getTime();
  console.log(`Took ${dt}ms, ${times / dt} maps / ms`);
  fs.writeFileSync('mapgendist.json', JSON.stringify(stats));
  // console.log(JSON.stringify(stats))
};
run(10000);
