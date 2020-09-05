import { generateMap } from '../src/GameMap/gen';

const map = generateMap();
console.log(map.getMapString());
console.log(map.cities);
