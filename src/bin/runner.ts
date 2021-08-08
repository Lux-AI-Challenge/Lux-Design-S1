import { LuxDesign } from '../design';
import * as Dimension from 'dimensions-ai';
import { MatchDestroyedError } from 'dimensions-ai/lib/main/DimensionError';
import { Logger, Tournament } from 'dimensions-ai';
import { Args } from '.';
import { TournamentType } from 'dimensions-ai/lib/main/Tournament/TournamentTypes';
export const runner = (argv: Args): void => {
  const maxtime = argv.maxtime;
  let loglevel = Dimension.Logger.LEVEL.INFO;
  switch (argv['loglevel']) {
    case 0:
      loglevel = Dimension.Logger.LEVEL.NONE;
      break;
    case 1:
      loglevel = Dimension.Logger.LEVEL.ERROR;
      break;
    case 2:
      loglevel = Dimension.Logger.LEVEL.INFO;
      break;
    case 3:
      loglevel = Dimension.Logger.LEVEL.DETAIL;
      break;
    case 4:
      loglevel = Dimension.Logger.LEVEL.ALL;
      break;
  }

  const storeLogs = argv.storeLogs;
  const storereplay = argv.storeReplay;
  const statefulReplay = argv.statefulReplay;

  let seed: number = Math.floor(Math.random() * 1e9);
  if (argv.seed !== undefined) {
    seed = argv.seed;
  }
  let out = argv.out;
  if (argv.out !== undefined) {
    out = argv.out;
  }

  let width = undefined;
  let height = undefined;
  if (argv.width !== undefined) {
    width = argv.width;
  }
  if (argv.height !== undefined) {
    height = argv.height;
  }

  const lux2021 = new LuxDesign('lux_ai_2021', {
    engineOptions: {
      noStdErr: false,
      timeout: {
        max: maxtime,
      },
      memory: {
        limit: argv.memory * 1024 * 1024
      }
    },
  });
  const dim = Dimension.create(lux2021, {
    name: 'Lux',
    loggingLevel: Logger.LEVEL.NONE,
    activateStation: false,
    observe: false,
    defaultMatchConfigs: {
      agentOptions: {
        runCommands: { '.py': [argv.python] },
      },
      storeErrorLogs: storeLogs,
    },
  });
  if (argv.tournament) {
    const resultHandler = (results: any): Tournament.RankSystem.Results => {
      // console.log(results)
      return results;

    }
    // console.log(argv._)
    // const competitors = JSON.parse(argv._[0] as string);
    const competitors = [];
    for (const file of argv._) {
      competitors.push({file, name: file});
    }
    const tournament = dim.createTournament(competitors, {
      name: 'Lux AI Season 1 Tournament',
      type: TournamentType.LADDER,
      rankSystem: argv.rankSystem as Tournament.RankSystemTypes,
      agentsPerMatch: [2],
      resultHandler,
      loggingLevel: loglevel
    });
    tournament.run({
      tournamentConfigs: {
        maxConcurrentMatches: argv.maxConcurrentMatches,
      },
      consoleDisplay: true,
      defaultMatchConfigs: {
        storeReplay: storereplay,
        statefulReplay,
        debug: false,
        width,
        height,
        runProfiler: false,
        debugDelay: 150,
        debugAnnotations: true,
        engineOptions: {
          noStdErr: false,
          timeout: {
            active: true,
          },
        },
        mapType: 'random',
        loggingLevel: Logger.LEVEL.NONE,
      },
    });
  }
  else {
    // take in two files
    const file1 = argv._[0] as string;
    const file2 = argv._[1] as string;
    if (!file1 || !file2) {
      throw Error('Need two paths to agents');
    }
  dim
    .runMatch(
      [
        { file: file1, name: file1 },
        { file: file2, name: file2 },
      ],
      {
        seed: seed,
        storeReplay: storereplay,
        statefulReplay,
        out,
        debug: false,
        width,
        height,
        runProfiler: false,
        debugDelay: 150,
        debugAnnotations: true,
        engineOptions: {
          noStdErr: false,
          timeout: {
            active: true,
          },
        },
        mapType: 'random',
        loggingLevel: loglevel,
      }
    )
    .then((r) => {
      r.ranks.forEach((info) => {
        if (info.agentID == 0) {
          info.name = file1;
        } else {
          info.name = file2;
        }
      });
      r.seed = seed;
      console.log(r);
    })
    .catch((err) => {
      if (err instanceof MatchDestroyedError) {
        // ignore;
      } else {
        dim.cleanup();
        throw err;
      }
    })
    .catch((err) => {
      console.error(err);
    })
    .finally(() => {
      dim.cleanup();
    });
  }
};
