#!/usr/bin/env node
import { LuxDesign } from './design';
import * as Dimension from 'dimensions-ai';
import yargs from 'yargs';
import { MatchDestroyedError } from 'dimensions-ai/lib/main/DimensionError';
yargs.options({
  'seed': {
    alias: 's',
    describe: 'seed for match'
  },
  'supress': {
    describe: 'supress all logs',
    default: 'false'
  },
  'maxtime': {
    describe: 'max time per turn for the bot',
    default: 1200
  },
  'storelogs': {
    describe: 'whether to store error logs as files',
    default: 'true'
  }
}).help()
const argv: any = yargs.argv;
// take in two files
const file1 = argv._[0];
const file2 = argv._[1];
let maxtime = 1200;
if (argv["maxtime"]) {
  maxtime = parseInt(argv["maxtime"]);
  if (isNaN(maxtime)) {
    throw Error('maxtime argument is not a number')
  }
}
let loglevel = Dimension.Logger.LEVEL.WARN;
if (argv["supress"]) {
  loglevel = Dimension.Logger.LEVEL.NONE;
}

let storelogs = true;
if (argv["storelogs"] === 'false') {
  storelogs = false;
}

if (argv["log"]) {
  loglevel = parseInt(argv["log"]);
  if (isNaN(loglevel)) {
    throw Error('log argument is not a number')
  }
}
let seed: any = Math.floor(Math.random() * 1000000);
if (argv["seed"]) {
  seed = argv["seed"];
}

const lux2021 = new LuxDesign('lux_ai_2021', {
  engineOptions: {
    noStdErr: false,
    timeout: {
      max: maxtime
    }
  }
});
const dim = Dimension.create(lux2021, {
  loggingLevel: loglevel,
  activateStation: false,
  observe: false,
  defaultMatchConfigs: {
    agentOptions: {
      runCommands: {'.py': ['python3']}
    },
    storeErrorLogs: storelogs
  }
});
dim.runMatch(
  [{ file: file1, name: file1}, { file: file2, name: file2} ], {
    seed: seed,
    storeReplay: true,
    compressReplay: false,
    debug: false,
    width: 16,
    height: 16,
    runProfiler: false,
    debugDelay: 150,
    debugAnnotations: true,
    engineOptions: {
      noStdErr: false,
      timeout: {
        active: true,
      },
    },
    mapType: 'debug',
    loggingLevel: loglevel
  }
).then((r) => console.log(r)).catch((err) => {
  if (err instanceof MatchDestroyedError) {
    // ignore;
  }
  else {
    throw err;
  }
}).catch((err) => {
  console.error(err)
});