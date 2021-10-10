import chai from 'chai';
import 'mocha';
const expect = chai.expect;
import { create, Logger, MatchEngine } from 'dimensions-ai';
import { LuxDesign, LuxMatchState } from '../src';

describe('Test kits', () => {
  const design = new LuxDesign('Lux Design');
  const luxdim = create(design, {
    name: 'luxdimension',
    id: 'luxdim',
    defaultMatchConfigs: {},
    loggingLevel: Logger.LEVEL.NONE,
    secureMode: false,
    observe: false,
    activateStation: false,
  });
  const bots = {
    js: {
      file: './kits/js/simple/main.js',
      name: 'js',
    },
    cpp: {
      file: './kits/cpp/simple/main.cpp',
      name: 'cpp',
    },
    cppTranspiled: {
      file: './kits/cpp/simple/main.js',
      name: 'cpp-transpiled',
    },
    java: {
      file: './kits/java/simple/Bot.java',
      name: 'java',
    },
    py: {
      file: './kits/python/simple/main.py',
      name: 'py',
    },
    rust: {
      file: './kits/rust/simple/main',
      name: 'rust',
    },
  };
  const options = {
    storeErrorLogs: false,
    storeReplay: false,
    compressReplay: false,
    seed: 0,
    debug: false,
    debugAnnotations: true,
    loggingLevel: Logger.LEVEL.NONE,
    mapType: 'random',
    engineOptions: {
      noStdErr: false,
      timeout: {
        active: true,
        max: 2000,
      },
    },
  };
  const verifyCommands = (
    cmds1: MatchEngine.Command[][],
    cmds2: MatchEngine.Command[][]
  ) => {
    for (let turn = 0; turn < cmds1.length; turn++) {
      const match1_cmds = cmds1[turn];
      const match2_cmds = cmds2[turn];
      expect(match1_cmds).to.eql(match2_cmds);
    }
  };
  it.skip('c++ consistency test', async () => {
    let botList = [bots.js, bots.cppTranspiled];
    const match = await luxdim.createMatch(botList, options);
    const res = await match.run();

    botList = [bots.js, bots.cpp];
    const match2 = await luxdim.createMatch(botList, options);
    const res2 = await match.run();
    const state: LuxMatchState = match.state;
    const state2: LuxMatchState = match.state;
    const cmds1 = state.game.replay.data.allCommands;
    const cmds2 = state2.game.replay.data.allCommands;
    verifyCommands(cmds1, cmds2);
  }).timeout(10000);

  it('should run c++', async () => {
    let botList = [bots.js, bots.cpp];
    const match = await luxdim.createMatch(botList, options);
    const res = await match.run();

    botList = [bots.cpp, bots.cpp];
    const match2 = await luxdim.createMatch(botList, options);
    const res2 = await match.run();
    const state: LuxMatchState = match.state;
    const state2: LuxMatchState = match.state;
    const cmds1 = state.game.replay.data.allCommands;
    const cmds2 = state2.game.replay.data.allCommands;
    verifyCommands(cmds1, cmds2);
  }).timeout(12000);

  it('should run python', async () => {
    let botList = [bots.js, bots.py];
    const match = await luxdim.createMatch(botList, options);
    const res = await match.run();

    botList = [bots.py, bots.py];
    const match2 = await luxdim.createMatch(botList, options);
    const res2 = await match.run();
    const state: LuxMatchState = match.state;
    const state2: LuxMatchState = match.state;
    const cmds1 = state.game.replay.data.allCommands;
    const cmds2 = state2.game.replay.data.allCommands;
    verifyCommands(cmds1, cmds2);
  }).timeout(10000);

  it('should run java', async () => {
    let botList = [bots.js, bots.java];
    const match = await luxdim.createMatch(botList, options);
    const res = await match.run();

    botList = [bots.java, bots.java];
    const match2 = await luxdim.createMatch(botList, options);
    const res2 = await match.run();
    const state: LuxMatchState = match.state;
    const state2: LuxMatchState = match.state;
    const cmds1 = state.game.replay.data.allCommands;
    const cmds2 = state2.game.replay.data.allCommands;
    verifyCommands(cmds1, cmds2);
  }).timeout(10000);

  it('should run rust', async () => {
    let botList = [bots.js, bots.rust];
    const match = await luxdim.createMatch(botList, options);
    const res = await match.run();

    botList = [bots.rust, bots.rust];
    const match2 = await luxdim.createMatch(botList, options);
    const res2 = await match.run();
    const state: LuxMatchState = match.state;
    const state2: LuxMatchState = match.state;
    const cmds1 = state.game.replay.data.allCommands;
    const cmds2 = state2.game.replay.data.allCommands;
    verifyCommands(cmds1, cmds2);
  }).timeout(10000);

  after(async () => {
    await luxdim.cleanup();
  });
});
