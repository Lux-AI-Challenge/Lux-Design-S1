import chai from 'chai';
import 'mocha';
const expect = chai.expect;
import fs from 'fs';
import { create, Logger } from 'dimensions-ai';
import { Game, LuxDesign, LuxDesignLogic } from '../src';
describe('Test statefulness', () => {
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
  const options = {
    storeErrorLogs: false,
    storeReplay: false,
    compressReplay: false,
    seed: 0,
    debug: false,
    debugAnnotations: true,
    loggingLevel: Logger.LEVEL.NONE,
    mapType: 'random',
    detached: true,
    agentOptions: { detached: true },
    engineOptions: {
      noStdErr: false,
      timeout: {
        active: true,
        max: 2000,
      },
    },
  };
  it.skip("should turn a match into a stateobject and then be able to reset a new match with that stateobject to get the same game state", async () => {
    // luxdim.createMatch()

    // replay generated using 
    // ts-node src/bin/index.ts --seed=0 --statefulReplay=true tests/bots/cpporganic/main.cpp tests/bots/cpporganic/main.cpp --out=stateful.json
    const replay_1: any = JSON.parse(
      `${fs.readFileSync('stateful.json')}`
    );
    const match = await luxdim.createMatch(["temp", "temp"], options);
    const testVals = [0, 100, 200, 359];
    for (const testval of testVals) {
      const start = testval;
      LuxDesignLogic.reset(match, replay_1.stateful[start]);
  
      for (let i = start; i < replay_1.allCommands.length; i++) {
        const cmds = replay_1.allCommands[i];
        await match.step(cmds);
        const game: Game = match.state.game;
        const stateobj = game.toStateObject();

        expect(replay_1.stateful[i+1]).to.eql(stateobj, `Error at step ${i} starting from ${start}`);
      }
    }

  });
  it.skip('Stateful replay should be same as action converted to stateful replay', () => {
    // generated directly
    const replay_1: any = JSON.parse(
      `${fs.readFileSync('replays/1625234780996_Xfgw1s4wW4Hb_stateful.json')}`
    );
    // generated from action based using converter
    const replay_2: any = JSON.parse(
      `${fs.readFileSync('replays/1625233629286_3qhur0FspkwR_stateful.json')}`
    );
    // check commands match
    for (let i = 0; i < replay_1.allCommands.length; i++) {
      const match1_cmds = replay_1.allCommands[i];
      const match2_cmds = replay_2.allCommands[i];
      expect(match1_cmds).to.eql(match2_cmds);
    }
    // check states match
    for (let i = 0; i < replay_1.stateful.length; i++) {
      const state1 = replay_1.stateful[i];
      const state2 = replay_2.stateful[i];
      expect(state1).to.eql(state2);
    }
  });
});
