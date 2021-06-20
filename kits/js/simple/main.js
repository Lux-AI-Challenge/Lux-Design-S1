const kit = require('./lux/kit');
const GAME_CONSTANTS = require('./lux/game_constants');
const DIRECTIONS = GAME_CONSTANTS.DIRECTIONS;
// create a new agent
const agent = new kit.Agent();

// first initialize the agent, and then proceed to go in a loop waiting for updates and running the AI
agent.initialize().then(async () => {
  while (true) {
    /** Do not edit! **/
    // wait for updates
    await agent.update();

    const commands = [];
    const gameState = agent.gameState;
    /** AI Code Goes Below! **/

    const player = gameState.players[gameState.id];
    const opponent = gameState.players[(gameState.id + 1) % 2];
    const gameMap = gameState.map;

    const resourceTiles = [];
    for (let y = 0; y < gameMap.height; y++) {
      for (let x = 0; x < gameMap.width; x++) {
        const cell = gameMap.getCell(x, y);
        if (cell.hasResource()) {
          resourceTiles.push(cell);
        }
      }
    }

    let citiesToBuild = 0;
    player.cities.forEach((city) => {
      if (city.getLightUpkeep() < city.fuel + 200) {
        citiesToBuild += 1;
      }
    });

    for (let i = 0; i < player.units.length; i++) {
      const unit = player.units[i];
      if (unit.isWorker()) {
        if (unit.getCargoSpaceLeft() > 0) {
          let closestResourceTile = null;
          let closestDist = 9999999;
          resourceTiles.forEach((cell) => {
            const dist = cell.pos.distanceTo(unit.pos);
            if (dist < closestDist) {
              closestDist = dist;
              closestResourceTile = cell;
            }
          })
          if (closestResourceTile != null) {
            const dir = unit.pos.directionTo(closestResourceTile.pos);
            commands.push(unit.move(dir));
          }
        } else {
          // if we have cities, return to them
          if (player.cities.size > 0) {
            const city = player.cities.values().next().value
            let closestDist = 999999;
            let closestCityTile = null;
            
            city.citytiles.forEach((citytile) => {
              const dist = citytile.pos.distanceTo(unit.pos);
              if (dist < closestDist) {
                closestCityTile = citytile;
                closestDist = dist;
              }
            });
            if (closestCityTile != null) {
              const dir = unit.pos.directionTo(closestCityTile.pos);
              if (citiesToBuild > 0 && unit.pos.isAdjacent(closestCityTile.pos) && unit.canBuild(gameMap)) {
                commands.push(unit.buildCity());
              } else {
                commands.push(unit.move(dir));
              }
            }
          }
        }
      }
    }
    /** AI Code Goes Above! **/

    /** Do not edit! **/
    console.log(commands.join(","));
    // end turn
    agent.endTurn();
    }
});