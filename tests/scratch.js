const {
  generateGame
} = require('../lib/Game/gen');

const game = generateGame();
console.log(game.map.getMapString());
console.log(game.cities);

console.log(game.state);
console.log('team 0 units', game.state.teamStates[0].units);