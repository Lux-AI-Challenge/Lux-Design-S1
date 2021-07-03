package lux;

public class Cell {
  public Position pos;
  public Resource resource = null;
  public double road = 0;
  public CityTile citytile = null;
  public Cell(int x, int y) {
    this.pos = new Position(x, y);
  }
  public boolean hasResource() {
    return this.resource != null && this.resource.amount > 0;
  }
}
