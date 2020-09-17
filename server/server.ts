import * as Dimensions from 'dimensions-ai';
const Tournament = Dimensions.Tournament;
const Logger = Dimensions.Logger;
const TournamentType = Dimensions.Tournament.Type;
import { LuxDesign } from '@lux-ai/2020-challenge';
const { GCloudDataStore, GCloudStorage } = Dimensions;
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
const setup = async () => {
  const dstore = new GCloudDataStore({
    keyFile: './keys/datastore-key.json',
  });
  const gcs = new GCloudStorage({
    projectId: 'lux-ai-test',
    keyFilename: './keys/gcs-key2.json',
  });
  await luxdim.use(dstore);
  await luxdim.use(gcs);
  const tourney = luxdim.createTournament([], {
    rankSystem: Tournament.RankSystemTypes.WINS,
    type: TournamentType.LADDER,
    resultHandler: LuxDesign.resultHandler,
    agentsPerMatch: [2],
    consoleDisplay: false,
    tournamentConfigs: {
      syncConfigs: false,
    },
    defaultMatchConfigs: {
      storeErrorLogs: true,
      loggingLevel: Logger.LEVEL.NONE,
      debug: false,
      mapType: 'debug',
    },
    name: 'Lux Tournament',
    id: 'luxtourney',
  });
};
setup();
