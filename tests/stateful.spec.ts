import chai from 'chai';
import 'mocha';
const expect = chai.expect;
import fs from 'fs';
describe("Test stateful replays", () => {
  it.skip("Stateful replay should be same as action converted to stateful replay", () => {

    // generated directly
    const replay_1: any = JSON.parse(`${fs.readFileSync("replays/1625234780996_Xfgw1s4wW4Hb_stateful.json")}`);
    // generated from action based using converter
    const replay_2: any = JSON.parse(`${fs.readFileSync("replays/1625233629286_3qhur0FspkwR_stateful.json")}`);
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
})