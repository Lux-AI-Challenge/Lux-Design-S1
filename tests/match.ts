// scratch cmds
// ts-node src/bin/index.ts tests/bots/pyorganic/main.py tests/bots/pyorganic/main.py --out=out.json

import * as Dimensions from 'dimensions-ai';
// test running a match
import { LuxDesign } from '../src';
import { Logger } from 'dimensions-ai';
const design = new LuxDesign('Lux Design');
const luxdim = Dimensions.create(design, {
  name: 'luxdimension',
  id: 'luxdim',
  defaultMatchConfigs: {},
  loggingLevel: Logger.LEVEL.NONE,
  secureMode: false,
  observe: false,
  activateStation: false,
});

const jsSimple = './kits/js/simple/main.js';
const pySimple = './kits/python/simple/main.py';
const rustSimple = './kits/rust/simple/src/main.rs';
const cppSimple = './kits/cpp/simple/main.cpp';
const cppOrganic = './tests/bots/cpporganic/main.cpp';
const javaSimple = './kits/java/simple/Bot.java';
const cppSimpleTranspiled = './kits/cpp/simple/main.js';
const cppOrganicTranspiled = './kits/cpp/organic/main.js';
const botList = [
  { file: cppOrganic, name: 'test1', existingID: 'abc' },
  { file: cppOrganic, name: 'cppjs', existingID: 'def' },
];
const run = async () => {
  const match = await luxdim.createMatch(botList, {
    storeErrorLogs: true,
    storeReplay: true,
    compressReplay: false,
    // seed: 189546085,
    debug: false,
    runProfiler: true,
    debugDelay: 150,
    debugAnnotations: true,
    engineOptions: {
      noStdErr: false,
      timeout: {
        active: true,
      },
    },
    loggingLevel: Logger.LEVEL.WARN,
  });

  console.log('Created match');
  const stime = new Date().valueOf();
  const res = await match.run();
  console.log(`Match took ${new Date().valueOf() - stime}ms`);
  // console.log(match.state.game.map.getMapString());
  console.log(res);
  if (match.state.profile) {
    console.log(
      `Update Stage: avg ${
        match.state.profile.updateStage.reduce((acc, curr) => acc + curr) /
        match.state.profile.updateStage.length
      }ms`
    );
    console.log(
      `Data Transfer: avg ${
        match.state.profile.dataTransfer.reduce((acc, curr) => acc + curr) /
        match.state.profile.dataTransfer.length
      }ms`
    );
  }
};
try {
  run();
} catch (err) {
  //
}
