import { Design, Match, Tournament, MatchEngine, DesignOptions } from 'dimensions-ai';
import { LuxMatchResults, LuxMatchState } from './types';
import { Unit } from './Unit';
import { LuxDesignLogic } from './logic';
import { DeepPartial } from 'dimensions-ai/lib/main/utils/DeepPartial';

export class LuxDesign extends Design {
  constructor(name: string, options: DeepPartial<DesignOptions> = {}) {
    super(name, options);
  }
  async initialize(match: Match): Promise<void> {
    return LuxDesignLogic.initialize(match);
  }

  async update(
    match: Match,
    commands: Array<MatchEngine.Command>
  ): Promise<Match.Status> {
    return LuxDesignLogic.update(match, commands);
  }

  // Result calculation of concluded match. Should return the results of a match after it finishes
  async getResults(match: Match): Promise<LuxMatchResults> {
    return LuxDesignLogic.getResults(match);
  }

  static resultHandler(
    results: LuxMatchResults
  ): Tournament.RankSystem.Results {
    const rankings = [];
    for (let i = 0; i < results.ranks.length; i++) {
      const info = results.ranks[i];
      rankings.push({ rank: info.rank, agentID: info.agentID });
    }
    return { ranks: rankings };
  }
}
