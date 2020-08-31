import * as Dimension from 'dimensions-ai';
import Match = Dimension.Match;
import Tournament = Dimension.Tournament;
import { LuxMatchResults, LuxMatchState } from './types';
import { DEFAULT_CONFIGS } from './defaults';


export class LuxDesign extends Dimension.Design {
  constructor(name: string) {
    super(name);
  }

  // Initialization step of each match
  async initialize(match: Match): Promise<void> {
    // initialize with default state and configurations
    const state: LuxMatchState = {
      configs: {...DEFAULT_CONFIGS},
      turn: 0
    };

    state.configs = {...state.configs, ...match.configs}

    // store the state into the match so it can be used again in `update` and `getResults`
    match.state = state;

    // send each agent their id
    for (let i = 0; i < match.agents.length; i++) {
      const agentID = match.agents[i].id;
      match.send(`${agentID}`, agentID);
    }
    // send all agents some global configs / parameters
    match.sendAll('');
  }

  // Update step of each match, called whenever the match moves forward by a single unit in time (1 timeStep)
  async update(
    match: Match,
    commands: Array<Dimension.MatchEngine.Command>
  ): Promise<Match.Status> {
    const state: LuxMatchState = match.state
    state.turn++;

    // loop over commands and handle them
    for (let i = 0; i < commands.length; i++) {
      // get the command and the agent that issued it and handle appropriately
      const command = commands[i].command;
      const agentID = commands[i].agentID;
    }

    if (state.turn % state.configs.parameters.DAY_LENGTH === 0) {
      // do something at night
      this.handleNight(state);
    }

    // send specific agents some information
    for (let i = 0; i < match.agents.length; i++) {
      const agent = match.agents[i];
      match.send('agentspecific', agent);
    }

    if (this.matchOver(match.state)) {
      return Match.Status.FINISHED;
    }
  }

  /**
   * Determine if match is over or not
   * @param state 
   */
  matchOver(state: Readonly<LuxMatchState>): boolean {
    if (state.turn === state.configs.parameters.MAX_DAYS) {
      return true;
    }
  }

  /**
   * Handle nightfall and update state accordingly
   * @param state 
   */
  handleNight(state: LuxMatchState): void {

  }

  // Result calculation of concluded match. Should return the results of a match after it finishes
  async getResults(match: Match): Promise<LuxMatchResults> {
    // calculate results
    const results = {
      ranks: [
        { rank: 1, agentID: 0 },
        { rank: 2, agentID: 2 },
        { rank: 3, agentID: 1 },
      ],
    };

    // return them
    return results;
  }
  
  // result handler for RankSystem.TRUESKILL or RankSystem.ELO
  static resultHandler(
    results: LuxMatchResults
  ): Tournament.RankSystem.TRUESKILL.Results | Tournament.RankSystem.ELO.Results {
    const rankings = [];
    for (let i = 0; i < results.ranks.length; i++) {
      const info = results.ranks[i];
      rankings.push({ rank: info.rank, agentID: info.agentID });
    }
    return { ranks: rankings };
  }
}
