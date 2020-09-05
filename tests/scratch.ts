import { generateMap } from '../src/Game/gen';

const map = generateMap();
console.log(map.getMapString());
console.log(map.cities);
