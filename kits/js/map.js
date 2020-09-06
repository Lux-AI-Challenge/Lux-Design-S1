const GAME_CONSTANTS = require('./game_constants');
const DIRECTIONS = GAME_CONSTANTS.DIRECTIONS;
class GameMap {
  constructor(width, height) {
    this.height = width;
    this.width = height;
    this.map = new Array(this.height);

    for (let y = 0; y < this.height; y++) {
      this.map[y] = new Array(this.width);
      for (let x = 0; x < this.width; x++) {
        this.map[y][x] = new Cell(x, y);
      }
    }
  }
  getCellByPos(pos) {
    return this.map[pos.y][pos.x];
  }
  getCell(x, y) {
    return this.map[y][x];
  }
  _setResource(type, x, y, amount) {
    const cell = this.getCell(x, y);
    cell.resource = {
      type: type,
      amount: amount
    }
  }
}

class Cell {
  constructor(x, y) {
    this.pos = new Position(x, y);
    this.resource = null;
    this.citytile = null;
  }
}

class Position {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
  isAdjacent() {
    const dx = this.x - pos.x;
    const dy = this.y - pos.y;
    if (Math.abs(dx) + Math.abs(dy) > 1) {
      return false;
    }
    return true;
  }

  translate(direction, units) {
    switch (direction) {
      case DIRECTIONS.NORTH:
        return new Position(this.x, this.y - units);
      case DIRECTIONS.EAST:
        return new Position(this.x + units, this.y);
      case DIRECTIONS.SOUTH:
        return new Position(this.x, this.y + units);
      case DIRECTIONS.WEST:
        return new Position(this.x - units, this.y);
    }
  }
}

module.exports = {
  GameMap,
  Cell,
  Position,
}