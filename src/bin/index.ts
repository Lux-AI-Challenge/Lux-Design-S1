#!/usr/bin/env node
import yargs from 'yargs';
import { runner } from './runner';
import { converter } from './converter';
const argv = yargs(process.argv.slice(2))
  .options({
    seed: {
      describe: 'a seed that randomly generates a initial match state',
      type: 'number',
    },
    loglevel: {
      describe:
        'set logger level. In increasing level / verbosity: 0 is for None. 1 for Errors. 2 for Warnings. 3 for Details. 4 for All',
      default: 2,
      type: 'number',
    },
    maxtime: {
      describe: 'max time per turn for the bot',
      default: 1200,
      type: 'number',
    },
    convertToStateful: {
      describe:
        'will convert the passed replay (.json) file into a stateful replay',
      type: 'boolean',
      default: false,
    },
    statefulReplay: {
      describe: 'whether to generate stateful replays',
      type: 'boolean',
      default: false,
    },
    storeLogs: {
      describe: 'whether to store error logs as files',
      type: 'boolean',
      default: true,
    },
    storeReplay: {
      describe: 'whether to store the replay or not',
      default: true,
      type: 'boolean',
    },
    width: {
      describe: 'set a specific width of the map',
      type: 'number',
    },
    height: {
      describe: 'set a specific height of the map',
      type: 'number',
    },
    out: {
      describe: 'where to store the resulting replay file',
      type: 'string',
    },
  })
  .help()
  .parseSync();
export type Args = typeof argv;
// const argv = yargs.argv;
const convertToStateful = argv.convertToStateful;
if (convertToStateful) {
  converter(argv);
} else {
  runner(argv);
}
