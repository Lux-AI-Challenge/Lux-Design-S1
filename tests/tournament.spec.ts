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
  observe: true,
  activateStation: true,
});

const botList = [];
const tourney = luxdim.createTournament(botList, {
  rankSystem: Tournament.RankSystem.TRUESKILL,
  type: TournamentType.LADDER,
  resultHandler: LuxDesign.resultHandler,
  agentsPerMatch: [2],
  consoleDisplay: true,
  name: 'Lux Tournament',
  id: 'luxtourney',
});
tourney.run();
