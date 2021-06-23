#!/usr/bin/env node
import { LuxDesign } from './design';
import * as Dimension from 'dimensions-ai';
import yargs from 'yargs';
import { MatchDestroyedError } from 'dimensions-ai/lib/main/DimensionError';
import { Logger } from 'dimensions-ai';
yargs.options({
  'seed': {
    describe: 'a seed that randomly generates a initial match state'
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
  },
  'compressreplay': {
    describe: 'whether to compress the replay',
    default: 'false',
  },
  'width': {
    describe: "set a specific width of the map",
  },
  'height': {
    describe: "set a specific height of the map"
  },
}).help()
const argv: any = yargs.argv;
// take in two files
const file1 = argv._[0];
const file2 = argv._[1];
if (!file1 || !file2) {
  throw Error("Need two paths to agents")
}
let maxtime = 1200;
if (argv["maxtime"]) {
  maxtime = parseInt(argv["maxtime"]);
  if (isNaN(maxtime)) {
    throw Error('maxtime argument is not a number')
  }
}
let loglevel = Dimension.Logger.LEVEL.INFO;
if (argv["supress"] == "true") {
  loglevel = Dimension.Logger.LEVEL.NONE;
}

let storelogs = true;
if (argv["storelogs"] === 'false') {
  storelogs = false;
}

let seed: any = Math.floor(Math.random() * 1e9);
if (argv["seed"] !== undefined) {
  seed = parseInt(argv["seed"]);
}

let compressReplay = false;
if (argv["compressReplay"] == "true") {
  compressReplay = true;
}

let width = undefined;
let height = undefined;
if (argv["width"]) {
  width = parseInt(argv["width"])
}
if (argv["height"]) {
  height = parseInt(argv["height"])
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
  name: "Lux",
  loggingLevel: Logger.LEVEL.NONE,
  activateStation: false,
  observe: false,
  defaultMatchConfigs: {
    agentOptions: {
      runCommands: {'.py': ['python3']}
    },
    storeErrorLogs: storelogs
  }
});
// dim.log.level = Logger.LEVEL.INFO
// dim.log.info("Starting Match")
dim.runMatch(
  [{ file: file1, name: file1}, { file: file2, name: file2} ], {
    seed: seed,
    storeReplay: true,
    compressReplay,
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
    loggingLevel: loglevel
  }
).then((r) => {
  r.ranks.forEach((info) => {
    if (info.agentID == 0) {
      info.name = file1
    } else {
      info.name = file2
    }
  });
  r.seed = seed
  console.log(r);
}).catch((err) => {
  if (err instanceof MatchDestroyedError) {
    // ignore;
  }
  else {
    throw err;
  }
}).catch((err) => {
  console.error(err)
});