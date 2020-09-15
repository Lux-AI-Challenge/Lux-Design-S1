import * as Dimensions from 'dimensions-ai';
import { LuxDesign } from '../src';
import { Logger, Tournament } from 'dimensions-ai';
import { TournamentType } from 'dimensions-ai/lib/Tournament/TournamentTypes';
const design = new LuxDesign('Lux Design');
const luxdim = Dimensions.create(design, {
  name: 'luxdimension',
  id: 'luxdim',
  defaultMatchConfigs: {},
  loggingLevel: Logger.LEVEL.INFO,
  secureMode: true,
  observe: false,
  activateStation: false,
});
const js = './kits/js/bot.js';
const testjs = './tests/bots/js/bot.js';
const bugjs = './kits/bug/bot.js';
const botList = [
  { file: js, name: 'js' },
  { file: testjs, name: 'better' },
];
const tourney = luxdim.createTournament(botList, {
  rankSystem: Tournament.RankSystemTypes.WINS,
  type: TournamentType.LADDER,
  resultHandler: LuxDesign.resultHandler,
  agentsPerMatch: [2],
  consoleDisplay: true,
  defaultMatchConfigs: {
    storeErrorLogs: false,
    loggingLevel: Logger.LEVEL.NONE,
    debug: false,
    mapType: 'debug',
  },
  name: 'Lux Tournament',
  id: 'luxtourney',
});
tourney.run();
