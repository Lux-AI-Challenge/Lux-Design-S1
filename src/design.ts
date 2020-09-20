import { Design, Match, Tournament, MatchEngine } from 'dimensions-ai';
import { LuxMatchResults, LuxMatchState } from './types';
import { Unit } from './Unit';
import { LuxDesignMock } from './mock';

export class LuxDesign extends Design {
  constructor(name: string) {
    super(name);
  }
  async initialize(match: Match): Promise<void> {
    return LuxDesignMock.initialize(match);
  }

  async update(
    match: Match,
    commands: Array<MatchEngine.Command>
  ): Promise<Match.Status> {
    return LuxDesignMock.update(match, commands);
  }

  // Result calculation of concluded match. Should return the results of a match after it finishes
  async getResults(match: Match): Promise<LuxMatchResults> {
    // calculate results
    const state: LuxMatchState = match.state;
    const game = state.game;
    let winningTeam = Unit.TEAM.A;
    let losingTeam = Unit.TEAM.B;
    figureresults: {
      // count city tiles
      const cityTileCount = [0, 0];
      game.cities.forEach((city) => {
        cityTileCount[city.team] += city.citycells.length;
      });
      if (cityTileCount[Unit.TEAM.A] > cityTileCount[Unit.TEAM.B]) {
        break figureresults;
      } else if (cityTileCount[Unit.TEAM.A] < cityTileCount[Unit.TEAM.B]) {
        winningTeam = Unit.TEAM.B;
        losingTeam = Unit.TEAM.A;
        break figureresults;
      }

      // if tied, count by units
      const unitCount = [
        game.getTeamsUnits(Unit.TEAM.A),
        game.getTeamsUnits(Unit.TEAM.B),
      ];
      if (unitCount[Unit.TEAM.A] > unitCount[Unit.TEAM.B]) {
        break figureresults;
      } else if (unitCount[Unit.TEAM.A] < unitCount[Unit.TEAM.B]) {
        winningTeam = Unit.TEAM.B;
        losingTeam = Unit.TEAM.A;
        break figureresults;
      }

      // if still undecided, for now, go by random choice
      if (state.rng() > 0.5) {
        winningTeam = Unit.TEAM.B;
        losingTeam = Unit.TEAM.A;
      }
    }

    const results = {
      ranks: [
        { rank: 1, agentID: winningTeam },
        { rank: 2, agentID: losingTeam },
      ],
      replayFile: null,
    };
    if (game.replay) {
      results.replayFile = game.replay.replayFilePath;
    }
    return results;
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
