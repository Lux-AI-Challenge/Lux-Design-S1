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
  .runMatch(botList, {
    storeErrorLogs: false,
    storeReplay: false,
    seed: 1,
    loggingLevel: Logger.LEVEL.ERROR,
  })
  .then((res) => {
    console.log(res);
  })
  .catch(console.error);
