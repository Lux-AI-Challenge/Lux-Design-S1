/**
 * All game constants
 * 
 * TODO: update all of these or use some common constants.json file for all kits
 */
const GAME_CONSTANTS = {
  UNIT_TYPES: {
    WORKER: 0,
    CART: 1,
  },
  RESOURCE_TYPES: {
    WOOD: 'wood',
    COAL: 'coal',
    URANIUM: 'uranium',
  },
  DIRECTIONS: {
    NORTH: 'n',
    WEST: 'w',
    EAST: 'e',
    SOUTH: 's,'
  },
  PARAMETERS: {
    RESOURCE_CAPACITY: {
      WORKER: 100,
      CART: 400,
    },
    LIGHT_UPKEEP: {
      CITY: 100,
      WORKER: 20,
      CART: 80,
    },
  }
}

module.exports = GAME_CONSTANTS;