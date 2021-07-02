#!/usr/bin/env node
import { LuxDesign } from '../design';
import * as Dimension from 'dimensions-ai';
import yargs from 'yargs';
import { MatchDestroyedError } from 'dimensions-ai/lib/main/DimensionError';
import { Logger } from 'dimensions-ai';
import { runner } from './runner';
import { converter } from './converter';
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
  'convertToStateful': {
    describe: 'will convert the passed replay (.json) file into a stateful replay',
    default: 'false'
  },
  'statefulReplay': {
    describe: 'whether to generate stateful replays',
    default: 'false'
  },
  'storelogs': {
    describe: 'whether to store error logs as files',
    default: 'true'
  },
  'storereplay': {
    describe: 'whether to store the replay or not',
    default: 'true'
  },
  'width': {
    describe: "set a specific width of the map",
  },
  'height': {
    describe: "set a specific height of the map"
  },
  'out': {
    describe: "where to store the resulting replay file",
  }
}).help()
const argv: any = yargs.argv;

let convertToStateful = false;
if (argv["convertToStateful"] === 'true') {
  convertToStateful = true;
}
if (convertToStateful) {
  converter(argv);
} else {
  runner(argv);
}



