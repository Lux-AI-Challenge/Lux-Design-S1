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
const botList = [js, js];
luxdim
  .createMatch(botList, {
    storeErrorLogs: false,
    storeReplay: false,
    seed: 1,
    debug: false,
    debugDelay: 2000,
    engineOptions: {
      noStdErr: false,
    },
    loggingLevel: Logger.LEVEL.DETAIL,
  })
  .then(async (match) => {
    const res = await match.run();
    console.log(match.state.game.map.getMapString());
    console.log(res);
  })
  .catch(console.error);
