package lux;

import java.util.ArrayList;

public class City {
  public String cityid;
  public int team;
  public double fuel;
  public ArrayList<CityTile> citytiles = new ArrayList<>();
  private double lightUpKeep = 0.0;
  public City(int teamid, String cityid, double fuel, double lightUpKeep) {
    this.cityid = cityid;
    this.team = teamid;
    this.fuel = fuel;
    this.lightUpKeep = lightUpKeep;
  }
  public CityTile _add_city_tile(int x, int y, double cooldown) {
    CityTile ct = new CityTile(this.team, this.cityid, x, y, cooldown);
    this.citytiles.add(ct);
    return ct;
  }
  public double getLightUpkeep() {
    return this.lightUpKeep;
  }
}