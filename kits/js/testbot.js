const kit = require('./kit');
const GAME_CONSTANTS = require('./game_constants');
const {
  Position
} = require('./map');
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

    let forestResources = [];
    for (let y = 0; y < agent.mapHeight; y++) {
      for (let x = 0; x < agent.mapWidth; x++) {
        const resource = agent.map.getCell(y, x).resource;
        if (resource !== null) {
          if (resource.type === GAME_CONSTANTS.RESOURCE_TYPES.WOOD) {
            forestResources.push({
              amount: resource.amount,
              pos: new Position(x, y)
            });
          }
        }
      }
    }

    const cityTilesArr = [];
    player.cities.forEach((city) => {
      cityTilesArr.push(...city.citytiles);
    })
    // make our units move south
    player.units.forEach((unit) => {
      if (unit.isWorker()) {
        // go to nearest forest, mine until just enough time to get back to city or full
        if (unit.getCargoSpaceLeft() > 0) {
          let closestForestPos = null;
          if (forestResources.length) {
            closestForestPos = findClosestPos(unit.pos, forestResources.map(({
              pos
            }) => pos));
          }

          if (closestForestPos) {
            const dir = unit.pos.directionTo(closestForestPos);
            if (dir !== null) {
              commands.push(unit.move(dir));
            }
          }

        } else {
          let closestCityPos = null;
          if (cityTilesArr.length) {
            closestCityPos = findClosestPos(unit.pos, cityTilesArr.map((cityTile) => cityTile.pos));
          }
          if (closestCityPos) {
            const dir = unit.pos.directionTo(closestCityPos);
            if (dir !== null) {
              commands.push(unit.move(dir));
            }
          }
        }
      }
    });

    /** AI Code ends here */

    // submit commands to the engine
    console.log(commands.join(','));

    // now we end our turn
    agent.endTurn();

  }
});

const findClosestPos = (startPos, arrOfPositions) => {
  let closestPos = arrOfPositions[0];
  let closestDist = 9999999;
  arrOfPositions.forEach((pos) => {
    const dist = startPos.distanceTo(pos);
    if (dist < closestDist) {

      closestDist = dist;
      closestPos = pos;
    }
  });
  return closestPos;
};