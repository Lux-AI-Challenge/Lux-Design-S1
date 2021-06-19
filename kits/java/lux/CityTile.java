package lux;

public class CityTile {
    public String cityid;
    public int team;
    public Position pos;
    public double cooldown;
    public CityTile(int teamid, String cityid, int x, int y, double cooldown) {
      this.cityid = cityid;
      this.team = teamid;
      this.pos = new Position(x, y);
      this.cooldown = cooldown;
    }
    public boolean canAct() {
      return this.cooldown < 1;
    }
    public String research() {
      return String.format("r %d %d", this.pos.x, this.pos.y);
    }
    public String buildWorker() {
      return String.format("bw %d %d", this.pos.x, this.pos.y);
    }
    public String buildCart() {
      return String.format("bc %d %d", this.pos.x, this.pos.y);
    }
}