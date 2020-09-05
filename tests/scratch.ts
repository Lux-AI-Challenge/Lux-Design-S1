import { generateGame } from '../src/Game/gen';

const game = generateGame();
console.log(game.map.getMapString());
console.log(game.cities);

console.log(game.state);
