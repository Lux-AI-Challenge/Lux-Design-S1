import * as Dimensions from 'dimensions-ai';
const { Logger, Tournament, GCloudDataStore, GCloudStorage } = Dimensions;
import { LuxDesign } from '@lux-ai/2020-challenge';

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

/** Define the images to use for each agent */
const languageSpecificAgentOptions: Dimensions.Agent.LanguageSpecificOptions = {
  '.py': {
    image: 'docker.io/python',
  },
  '.go': {
    image: 'docker.io/golang',
  },
  '.js': {
    image: 'docker.io/node',
  },
};

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
  luxdim.createTournament([], {
    rankSystem: Tournament.RankSystemTypes.TRUESKILL,
    type: Tournament.Type.LADDER,
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
      languageSpecificAgentOptions,
    },
    name: 'Lux Tournament',
    id: 'luxtourney',
  });
};
setup();
