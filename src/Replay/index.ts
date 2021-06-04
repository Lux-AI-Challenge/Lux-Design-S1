import { Agent, Match, MatchEngine } from 'dimensions-ai';
import fs from 'fs';
import JSZip from 'jszip';
import path from 'path';
import { GameMap } from '../GameMap';

export class Replay {
  public replayFilePath: string = null;
  public data: {
    seed: number;
    width: number;
    height: number;
    mapType: GameMap.Types;
    teamDetails: Array<{
      name: string;
      tournamentID: string;
    }>;
    allCommands: Array<Array<MatchEngine.Command>>;
  } = {
    seed: 0,
    allCommands: [],
    mapType: GameMap.Types.RANDOM,
    width: -1,
    height: -1,
    teamDetails: [],
  };
  public storeReplay: boolean = false;
  constructor(match: Match, public compressReplay: boolean) {
    const d = new Date().valueOf();
    let replayFileName = `${d}_${match.id}`;
    if (compressReplay) {
      replayFileName += '.luxr';
    } else {
      replayFileName += '.json';
    }
    this.replayFilePath = path.join(
      match.configs.storeReplayDirectory,
      replayFileName
    );
    this.storeReplay = match.configs.storeReplay;
    if (fs.existsSync && this.storeReplay) {
      if (!fs.existsSync(match.configs.storeReplayDirectory)) {
        fs.mkdirSync(match.configs.storeReplayDirectory, { recursive: true });
      }
      fs.writeFileSync(this.replayFilePath, '');
    }
  }
  public writeTeams(agents: Agent[]): void {
    agents.forEach((agent) => {
      let id = '';
      if (agent.tournamentID && agent.tournamentID.id) {
        id = agent.tournamentID.id;
      }
      this.data.teamDetails.push({
        name: agent.name,
        tournamentID: id,
      });
    });
  }
  public writeOut(): void {
    if (!fs.appendFileSync || !this.storeReplay) return;
    if (this.compressReplay) {
      const zipper = new JSZip();
      zipper.file(this.replayFilePath, JSON.stringify(this.data));
      zipper
        .generateAsync({
          type: 'nodebuffer',
          compression: 'DEFLATE',
          compressionOptions: {
            level: 9,
          },
        })
        .then((content) => {
          fs.appendFileSync(this.replayFilePath, content);
        });
    } else {
      fs.appendFileSync(this.replayFilePath, JSON.stringify(this.data));
    }
  }
}
