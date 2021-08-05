package lux;

public class Unit {
  public Position pos;
  public int team;
  public String id;
  public int type;
  public double cooldown;
  public Cargo cargo;
  public Unit(int teamid, int u_type, String unitid, int x, int y, double cooldown, int wood, int coal, int uranium) {
    this.pos = new Position(x, y);
    this.team = teamid;
    this.id = unitid;
    this.type = u_type;
    this.cooldown = cooldown;
    this.cargo = new Cargo(wood, coal, uranium);
  }
  public boolean isWorker() {
    return this.type == 0;
  }
  public boolean isCart() {
    return this.type == 1;
  }
  public int getCargoSpaceLeft() {
    int spaceused = this.cargo.wood + this.cargo.coal + this.cargo.uranium;
    if (this.type == GameConstants.UNIT_TYPES.WORKER) {
      return GameConstants.PARAMETERS.RESOURCE_CAPACITY.WORKER - spaceused;
    } else {
      return GameConstants.PARAMETERS.RESOURCE_CAPACITY.CART - spaceused;
    }
  }
  public boolean canBuild(GameMap gameMap) {
    Cell cell = gameMap.getCellByPos(this.pos);
    if (!cell.hasResource() && this.canAct() && (this.cargo.wood + this.cargo.coal + this.cargo.uranium) >= GameConstants.PARAMETERS.CITY_BUILD_COST) return true;
    return false;
  }
  public boolean canAct() {
    return this.cooldown < 1;
  }
  public String move(Direction dir) {
    return String.format("m %s %s", this.id, dir);
  }
  public String transfer(String destId, String resourceType, int amount) {
    return String.format("t %s %s %s %d", this.id, destId, resourceType, amount);
  }
  public String buildCity() {
    return String.format("bcity %s", this.id);
  }
  public String pillage() {
    return String.format("p %s", this.id);
  }
}
