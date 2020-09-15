const Dimensions = require('dimensions-ai');
// test running a match
const { LuxDesign } = require('../lib');
const Logger = Dimensions.Logger;
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
const bugjs = './kits/bug/bot.js';
const botList = [js, bugjs];
const run = async () => {
  let match = await luxdim.createMatch(botList, {
    storeErrorLogs: true,
    storeReplay: false,
    seed: 1,
    debug: false,
    runProfiler: false,
    debugDelay: 100,
    engineOptions: {
      noStdErr: false,
    },
    mapType: 'debug',
    loggingLevel: Logger.LEVEL.ALL,
  });

  console.log('Created match');
  const stime = new Date().valueOf();
  const res = await match.run().catch((err) => {});
  console.log(`Match took ${new Date().valueOf() - stime}ms`);
  // console.log(match.state.game.map.getMapString());
  console.log({
    res,
  });
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
  match.destroy();
};
run().catch((err) => {});
