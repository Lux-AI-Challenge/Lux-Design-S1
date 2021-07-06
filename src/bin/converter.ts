import { create, Logger, Match } from 'dimensions-ai';
import { DeepPartial } from 'dimensions-ai/lib/main/utils/DeepPartial';
import fs from 'fs';
import { LuxDesign } from '../design';
import { LuxMatchConfigs, LuxMatchState } from '../types';
import path from 'path';
import { Args } from '.';

export const converter = async (argv: Args): Promise<void> => {
  const replayFile = argv._[0] as string;
  if (!replayFile) {
    throw Error('Need to provide path to replay file');
  }
  const replay: any = JSON.parse(`${fs.readFileSync(replayFile)}`);
  const lux2021 = new LuxDesign('lux_ai_2021', {
    engineOptions: {
      noStdErr: false,
      timeout: {
        max: 1200,
      },
    },
  });
  const myDimension = create(lux2021, {
    name: 'Lux AI 2021',
    loggingLevel: Logger.LEVEL.NONE,
    activateStation: false,
    observe: false,
    createBotDirectories: false,
  });
  const configs: DeepPartial<LuxMatchConfigs & Match.Configs> = {
    detached: true,
    agentOptions: { detached: true },
    storeReplay: false,
    storeErrorLogs: false,
    statefulReplay: true,
    seed: parseInt(replay.seed),
    mapType: replay.mapType,
  };
  const match = await myDimension.createMatch(
    [
      {
        file: 'blank',
        name: 'bot1',
      },
      {
        file: 'blank',
        name: 'bot2',
      },
    ],
    configs
  );
  match.agents.forEach((agent) => {
    agent.messages = [];
  });

  for (let i = 0; i < replay.allCommands.length; i++) {
    const commandsList = replay.allCommands[i];
    await match.step(commandsList);

    match.agents.forEach((agent) => {
      agent.messages = [];
    });
  }
  const state: LuxMatchState = match.state;
  const newfilename =
    path.basename(replayFile).split('.')[0] + '_stateful.json';
  const newfilepath = path.join(path.dirname(replayFile), newfilename);
  fs.writeFileSync(newfilepath, JSON.stringify(state.game.replay.data));
  console.log(`Converted ${replayFile}. Stateful replay at ${newfilepath}`);
};
