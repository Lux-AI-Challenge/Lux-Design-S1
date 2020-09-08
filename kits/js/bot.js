const kit = require('./lux/kit');
const GAME_CONSTANTS = require('./lux/game_constants');
const DIRECTIONS = GAME_CONSTANTS.DIRECTIONS;
// create a new agent
const agent = new kit.Agent();

// first initialize the agent, and then proceed to go in a loop waiting for updates and running the AI
agent.initialize().then(async () => {
  while (true) {
    // wait for update from match engine
    await agent.update();

    // player is your player, opponent is the opposing player
    const player = agent.players[agent.id];
    const opponent = agent.players[(agent.id + 1) % 2];

    /** AI Code goes here */

    let commands = [];

    // make our units move south
    if (agent.turn % 10 === 2 || (agent.turn % 10 === 1 && agent.turn !== 1)) {
      player.units.forEach((unit) => {
        commands.push(unit.move(DIRECTIONS.SOUTH));
      });
    } else if (agent.turn % 10 === 7 || agent.turn % 10 === 8) {
      player.units.forEach((unit) => {
        commands.push(unit.move(DIRECTIONS.NORTH));
      });
    }

    /** AI Code ends here */

    // submit commands to the engine
    console.log(commands.join(','));

    // now we end our turn
    agent.endTurn();

  }
});