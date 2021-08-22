import chai from 'chai';
import 'mocha';
const expect = chai.expect;
import fs from 'fs';
import { create, Logger } from 'dimensions-ai';
import { Game, LuxDesign, LuxDesignLogic, LuxMatchState } from '../src';
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
const stats = {

}
const run = async (times = 10000) => {
  const stime = new Date();
  for (let i =0 ; i < times; i++) {
    options.seed = i;
    // console.log("Gen", i)
    const match = await luxdim.createMatch(['temp', 'temp'], options);
    const state: LuxMatchState = match.state;
    const resources = {
      wood: 0,
      coal: 0,
      uranium: 0,
      woodTiles:0,
      coalTiles:0,
      uraniumTiles:0,
    }
    for (let y = 0; y < state.game.map.height; y++) {
      for (let x = 0; x < state.game.map.width; x++) {
        const cell = state.game.map.getCell(x, y);
        if (cell.hasResource()) {
          resources[cell.resource.type] += cell.resource.amount
          resources[`${cell.resource.type}Tiles`] += 1
        }
      }
    }
    const key = state.game.map.height
    if (stats[key] !== undefined) {
      stats[key].resources.push(resources)
      stats[key].count += 1
    } else {
      stats[key] = {resources: [resources], count: 1}
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
  console.log(`Took ${dt}ms, ${times/dt} maps / ms`)
  fs.writeFileSync("mapgendist.json", JSON.stringify(stats))
  // console.log(JSON.stringify(stats))
}
run(10000);