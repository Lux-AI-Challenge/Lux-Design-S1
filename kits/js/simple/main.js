const kit = require('./lux/kit');
const GAME_CONSTANTS = require('./lux/game_constants');
const DIRECTIONS = GAME_CONSTANTS.DIRECTIONS;
// create a new agent
const agent = new kit.Agent();
const annotate = kit.annotate;

// first initialize the agent, and then proceed to go in a loop waiting for updates and running the AI
agent.initialize().then(async () => {
  while (true) {
    /** Do not edit! **/
    // wait for updates
    await agent.update();

    const actions = [];
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
      // if our city has enough fuel to survive the whole night and 1000 extra fuel, lets increment citiesToBuild and let our workers know we have room for more city tiles
      if (city.fuel > city.getLightUpkeep() * GAME_CONSTANTS.PARAMETERS.NIGHT_LENGTH + 1000) {
        citiesToBuild += 1;
      }
      city.citytiles.forEach((citytile) => {
        if (citytile.canAct()) {   
          // you can use the following to get the citytile to research or build a worker
          // commands.push(citytile.research());
          // commands.push(citytile.buildWorker());
        }
      });
    });

    // we iterate over all our units and do something with them
    for (let i = 0; i < player.units.length; i++) {
      const unit = player.units[i];
      if (unit.isWorker() && unit.canAct()) {
        if (unit.getCargoSpaceLeft() > 0) {
          // if the unit is a worker and we have space in cargo, lets find the nearest resource tile and try to mine it
          let closestResourceTile = null;
          let closestDist = 9999999;
          resourceTiles.forEach((cell) => {
            if (cell.resource.type === GAME_CONSTANTS.RESOURCE_TYPES.COAL && !player.researchedCoal()) return;
            if (cell.resource.type === GAME_CONSTANTS.RESOURCE_TYPES.URANIUM && !player.researchedUranium()) return;
            const dist = cell.pos.distanceTo(unit.pos);
            if (dist < closestDist) {
              closestDist = dist;
              closestResourceTile = cell;
            }
          })
          if (closestResourceTile != null) {
            const dir = unit.pos.directionTo(closestResourceTile.pos);
            // move the unit in the direction towards the closest resource tile's position.
            actions.push(unit.move(dir));
          }
        } else {
          // if unit is a worker and there is no cargo space left, and we have cities, lets return to them
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
                // here we consider building city tiles provided we are adjacent to a city tile and we can build
                actions.push(unit.buildCity());
              } else {
                actions.push(unit.move(dir));
              }
            }
          }
        }
      }
    }

    // you can add debug annotations using the functions in the annotate object
    // actions.push(annotate.circle(0, 0))
    
    /** AI Code Goes Above! **/

    /** Do not edit! **/
    console.log(actions.join(","));
    // end turn
    agent.endTurn();
    }
});