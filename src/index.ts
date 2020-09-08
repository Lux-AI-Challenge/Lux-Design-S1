import * as Dimension from 'dimensions-ai';
import Match = Dimension.Match;
import Tournament = Dimension.Tournament;
import { LuxMatchResults, LuxMatchState } from './types';
import { DEFAULT_CONFIGS } from './defaults';
import { generateGame } from './Game/gen';
import {
  Action,
  SpawnWorkerAction,
  SpawnCityAction,
  SpawnCartAction,
  ResearchAction,
  TransferAction,
  MoveAction,
} from './Actions';
import { Game } from './Game';
import { Unit } from './Unit';
import seedrandom from 'seedrandom';
import { sleep } from './utils';

export class LuxDesign extends Dimension.Design {
  constructor(name: string) {
    super(name);
  }

  // Initialization step of each match
  async initialize(match: Match): Promise<void> {
    // initialize with default state and configurations and default RNG
    const state: LuxMatchState = {
      configs: { ...DEFAULT_CONFIGS },
      game: null,
      rng: seedrandom(`${Math.random()}`),
    };
    state.configs = { ...state.configs, ...match.configs };

    if (state.configs.seed !== undefined) {
      state.rng = seedrandom(`${state.configs.seed}`);
    }
    state.game = generateGame(state.configs);

    match.log.info(state.configs);
    // store the state into the match so it can be used again in `update` and `getResults`
    match.state = state;

    // send each agent their id
    for (let i = 0; i < match.agents.length; i++) {
      const agentID = match.agents[i].id;
      await match.send(`${agentID}`, agentID);
    }
    // send all agents the current map width and height
    // `width height` - width and height of the map
    await match.sendAll(`${state.game.map.width} ${state.game.map.height}`);

    await this.sendAllAgentsGameInformation(match);
    await match.sendAll('D_DONE');
  }

  /**
   * Sends map information formatted as so
   *
   * `rp t points` - the number of research points team `t` has
   *
   * `r resource_type x y amount` - the amount of resource of that type at `(x, y)`
   * ...
   *
   * `u unit_type t unit_id x y cd w c u` - the unit on team `t` with id unit_id of type unit_type at `(x, y)` with cooldown `cd`,
   * and `w` `c` `u` units of wood, coal, uranium
   * ...
   *
   * `c t city_id f` - citeam `t`'s city with id city_id and fuel `f`
   * ...
   *
   * `ct t city_id x y cd` - team `t`'s city tile part of city with id city_id at `(x, y)` with cooldown `cd`
   * ...
   *
   *
   *
   *
   *
   */
  async sendAllAgentsGameInformation(match: Match): Promise<void> {
    const game: Game = match.state.game;
    const map = game.map;

    let promises: Array<Promise<boolean>> = [];
    const teams = [Unit.TEAM.A, Unit.TEAM.B];

    // send research points
    teams.forEach((team) => {
      const pts = game.state.teamStates[team].researchPoints;
      promises.push(match.sendAll(`rp ${team} ${pts}`));
    });
    await Promise.all(promises);

    // send resource information
    promises = [];
    map.resourcesMap.forEach((cell) => {
      promises.push(
        match.sendAll(
          `r ${cell.resource.type} ${cell.pos.x} ${cell.pos.y} ${cell.resource.amount}`
        )
      );
    });
    await Promise.all(promises);

    // send unit information
    promises = [];
    teams.forEach((team) => {
      const units = game.getTeamsUnits(team);
      units.forEach((unit) => {
        promises.push(
          match.sendAll(
            `u ${unit.type} ${team} ${unit.id} ${unit.pos.x} ${unit.pos.y} ${unit.cooldown} ${unit.cargo.wood} ${unit.cargo.coal} ${unit.cargo.uranium}`
          )
        );
      });
    });

    await Promise.all(promises);

    // send city information
    promises = [];
    game.cities.forEach((city) => {
      promises.push(match.sendAll(`c ${city.team} ${city.id} ${city.fuel}`));
    });
    await Promise.all(promises);

    promises = [];
    game.cities.forEach((city) => {
      city.citycells.forEach((cell) => {
        promises.push(
          match.sendAll(
            `ct ${city.team} ${city.id} ${cell.pos.x} ${cell.pos.y} ${cell.citytile.cooldown}`
          )
        );
      });
    });
    await Promise.all(promises);
  }

  // Update step of each match, called whenever the match moves forward by a single unit in time (1 timeStep)
  async update(
    match: Match,
    commands: Array<Dimension.MatchEngine.Command>
  ): Promise<Match.Status> {
    const state: LuxMatchState = match.state;
    const game = state.game;

    match.log.detail('Processing turn ' + game.state.turn);
    // check if any agents are terminated and finish game if so
    const agentsTerminated = [false, false];
    match.agents.forEach((agent) => {
      if (agent.isTerminated()) {
        agentsTerminated[agent.id] = true;
      }
    });

    if (agentsTerminated[0] || agentsTerminated[1]) {
      // if at least 1 agent was terminated, destroy the terminated agents' cities and units
      game.cities.forEach((city) => {
        if (agentsTerminated[city.team]) {
          game.destroyCity(city.id);
        }
      });
      const teams = [Unit.TEAM.A, Unit.TEAM.B];
      for (const team of teams) {
        if (agentsTerminated[team]) {
          game.state.teamStates[team].units.forEach((unit) => {
            game.destroyUnit(unit.team, unit.id);
          });
        }
      }
      if (state.configs.debug) {
        await this.debugViewer(game);
      }
      return Match.Status.FINISHED;
    }

    // loop over commands and validate and map into internal action representations
    const actionsMap: Map<Game.ACTIONS, Array<Action>> = new Map();
    Object.values(Game.ACTIONS).forEach((val) => {
      actionsMap.set(val, []);
    });
    for (let i = 0; i < commands.length; i++) {
      // get the command and the agent that issued it and handle appropriately
      const agentID = commands[i].agentID;
      try {
        const action = game.validateCommand(commands[i]);
        // TODO: this might be slow, depends on its optimized and compiled
        const newactionArray = [...actionsMap.get(action.action), action];
        actionsMap.set(action.action, newactionArray);
      } catch (err) {
        match.throw(agentID, err);
      }
    }

    // first distribute all resources
    game.map.resourcesMap.forEach((cell) => {
      game.handleResourceRelease(cell);
    });

    // give units and city tiles their validated actions to use
    actionsMap
      .get(Game.ACTIONS.BUILD_CITY)
      .forEach((action: SpawnCityAction) => {
        game.getUnit(action.team, action.unitid).giveAction(action);
      });
    actionsMap
      .get(Game.ACTIONS.BUILD_WORKER)
      .forEach((action: SpawnWorkerAction) => {
        const citytile = game.map.getCell(action.x, action.y).citytile;
        citytile.giveAction(action);
      });
    actionsMap
      .get(Game.ACTIONS.BUILD_CART)
      .forEach((action: SpawnCartAction) => {
        const citytile = game.map.getCell(action.x, action.y).citytile;
        citytile.giveAction(action);
      });
    actionsMap.get(Game.ACTIONS.RESEARCH).forEach((action: ResearchAction) => {
      const citytile = game.map.getCell(action.x, action.y).citytile;
      citytile.giveAction(action);
    });
    actionsMap.get(Game.ACTIONS.TRANSFER).forEach((action: TransferAction) => {
      game.getUnit(action.team, action.srcID).giveAction(action);
    });

    const prunedMoveActions = game.handleMovementActions(
      actionsMap.get(Game.ACTIONS.MOVE) as Array<MoveAction>,
      match
    );

    prunedMoveActions.forEach((action) => {
      game.getUnit(action.team, action.unitid).giveAction(action);
    });

    // now we go through every actionable entity and execute actions
    game.cities.forEach((city) => {
      city.citycells.forEach((cellWithCityTile) => {
        try {
          cellWithCityTile.citytile.handleTurn(game);
        } catch (err) {
          match.throw(cellWithCityTile.citytile.team, err);
        }
      });
    });
    const teams = [Unit.TEAM.A, Unit.TEAM.B];
    for (const team of teams) {
      game.state.teamStates[team].units.forEach((unit) => {
        try {
          unit.handleTurn(game);
        } catch (err) {
          match.throw(unit.team, err);
        }
      });
    }

    // now we make all units with cargo drop all resources on the city they are standing on
    for (const team of teams) {
      game.state.teamStates[team].units.forEach((unit) => {
        game.handleResourceDeposit(unit);
      });
    }

    if (
      game.state.turn !== 0 &&
      game.state.turn % state.configs.parameters.DAY_LENGTH === 0
    ) {
      // do something at night
      this.handleNight(state);
    }

    if (state.configs.debug) {
      await this.debugViewer(game);
    }

    if (this.matchOver(match)) {
      return Match.Status.FINISHED;
    }

    /** Agent Update Section */
    await this.sendAllAgentsGameInformation(match);
    // tell all agents updates are done
    await match.sendAll('D_DONE');
    game.state.turn++;
    match.log.detail('Beginning turn ' + game.state.turn);
  }

  async debugViewer(game: Game): Promise<void> {
    console.clear();
    console.log(game.map.getMapString());
    console.log(`Turn: ${game.state.turn}`);
    const teams = [Unit.TEAM.A, Unit.TEAM.B];
    for (const team of teams) {
      const teamstate = game.state.teamStates[team];
      let msg = `RP: ${teamstate.researchPoints} | Units: ${teamstate.units.size}`;
      // teamstate.units.forEach((unit) => {
      //   msg += `| ${unit.id} (${unit.pos.x}, ${
      //     unit.pos.y
      //   }) cargo space: ${unit.getCargoSpaceLeft()}`;
      // });
      if (team === Unit.TEAM.A) {
        console.log(msg.cyan);
      } else {
        console.log(msg.red);
      }
    }
    game.cities.forEach((city) => {
      let iden = `City ${city.id}`.red;
      if (city.team === 0) {
        iden = `City ${city.id}`.cyan;
      }
      console.log(
        `${iden} light: ${city.fuel} - size: ${city.citycells.length}`
      );
    });
    await sleep(game.configs.debugDelay);
  }

  /**
   * Determine if match is over or not
   * @param state
   */
  matchOver(match: Match): boolean {
    const state: Readonly<LuxMatchState> = match.state;
    const game = state.game;

    if (game.state.turn === state.configs.parameters.MAX_DAYS) {
      return true;
    }
    // over if at least one team has no units left or city tiles
    const teams = [Unit.TEAM.A, Unit.TEAM.B];
    const cityCount = [0, 0];

    game.cities.forEach((city) => {
      cityCount[city.team] += 1;
    });

    for (const team of teams) {
      if (game.getTeamsUnits(team).size + cityCount[team] === 0) {
        return true;
      }
    }
  }

  /**
   * Handle nightfall and update state accordingly
   * @param state
   */
  handleNight(state: LuxMatchState): void {
    const game = state.game;
    game.cities.forEach((city) => {
      // if city does not have enough fuel, destroy it
      // TODO, probably add this event to replay
      if (city.fuel < city.getLightUpkeep()) {
        game.destroyCity(city.id);
      } else {
        city.fuel -= city.getLightUpkeep();
      }
    });
    game.state.teamStates[0].units.forEach((unit) => {
      // TODO: add condition for different light upkeep for units stacked on a city.
      if (!game.map.getCellByPos(unit.pos).isCityTile()) {
        if (!unit.spendFuelToSurvive()) {
          // delete unit
          game.destroyUnit(unit.team, unit.id);
        }
      }
    });
    game.state.teamStates[1].units.forEach((unit) => {
      if (!game.map.getCellByPos(unit.pos).isCityTile()) {
        if (!unit.spendFuelToSurvive()) {
          // delete unit
          game.destroyUnit(unit.team, unit.id);
        }
      }
    });
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
    };
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
