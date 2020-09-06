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
  secureMode: true,
  observe: true,
  activateStation: true,
});

const js = './kits/js/bot.js';
const botList = [js, js];
luxdim
  .runMatch(botList, {
    storeErrorLogs: false,
    storeReplay: false,
    seed: 1,
  })
  .then((res) => {
    console.log(res);
  })
  .catch(console.error);
