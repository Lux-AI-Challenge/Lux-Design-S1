import * as Dimensions from 'dimensions-ai';
// test running a match
import { LuxDesign } from '../src';
import { Logger } from 'dimensions-ai';
const design = new LuxDesign('Lux Design');
const luxdim = Dimensions.create(design, {
  name: 'luxdimension',
  id: 'luxdim',
  defaultMatchConfigs: {},
  loggingLevel: Logger.LEVEL.INFO,
  secureMode: false,
  observe: false,
  activateStation: false,
});

const js = './kits/js/bot.js';
const testjs = './tests/bots/js/bot.js';
const spamjs = './tests/bots/spam/bot.js';
const bugjs = './kits/bug/bot.js';
const botList = [
  { file: spamjs, name: 'spambot', existingID: 'abc' },
  { file: testjs, name: 'better', existingID: 'def' },
];
const run = async () => {
  const match = await luxdim.createMatch(botList, {
    storeErrorLogs: false,
    storeReplay: true,
    compressReplay: false,
    // seed: 1,
    debug: false,
    width: 16,
    height: 16,
    runProfiler: true,
    debugDelay: 150,
    debugAnnotations: true,
    engineOptions: {
      noStdErr: false,
    },
    loggingLevel: Logger.LEVEL.ALL,
    mapType: 'debug',
  });

  console.log('Created match');
  const stime = new Date().valueOf();
  const res = await match.run();
  console.log(`Match took ${new Date().valueOf() - stime}ms`);
  // console.log(match.state.game.map.getMapString());
  console.log(res);
  if (match.state.profile) {
    console.log(
      `Update Stage: avg ${match.state.profile.updateStage.reduce((acc, curr) => acc + curr) /
      match.state.profile.updateStage.length
      }ms`
    );
    console.log(
      `Data Transfer: avg ${match.state.profile.dataTransfer.reduce((acc, curr) => acc + curr) /
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
