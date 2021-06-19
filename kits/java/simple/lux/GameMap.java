package lux;

public class GameMap {
  public int width;
  public int height;
  public Cell[][] map;
  public GameMap(int width, int height) {
    this.width = width;
    this.height = height;
    this.map = new Cell[height][width];
    for (int y = 0; y < this.height; y++) {
      for (int x = 0; x < this.width; x++) {
        this.map[y][x] = new Cell(x, y);
      }
    }
  }
  public Cell getCellByPos(Position pos) {
    return this.map[pos.y][pos.x];
  }
  public Cell getCell(int x, int y) {
    return this.map[y][x];
  }
  /** Internal use only */
  public void _setResource(String rType, int x, int y, int amount) {
    Cell cell = this.getCell(x, y);
    cell.resource = new Resource(rType, amount);
  }
}