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

    // contains all gameState in the current turn
    const gameState = agent.gameState
    
    // player is your player, opponent is the opposing player
    const player = gameState.players[gameState.id];
    const opponent = gameState.players[(gameState.id + 1) % 2];
    let commands = [];

    /** AI Code goes here */

    // make our units move south
    if (gameState.turn % 10 === 2 || (gameState.turn % 10 === 1 && gameState.turn !== 1)) {
      player.units.forEach((unit) => {
        commands.push(unit.move(DIRECTIONS.SOUTH));
      });
    } else if (gameState.turn % 10 === 7 || gameState.turn % 10 === 8) {
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