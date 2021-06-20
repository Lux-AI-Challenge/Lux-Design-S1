package lux;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

public class Player {
  public int team;
  public int researchPoints;
  public ArrayList<Unit> units = new ArrayList<>();
  public Map<String, City> cities = new HashMap<>();
  public int cityTileCount;
  public Player(int team) {
    this.team = team;
    this.researchPoints = 0;
    this.cityTileCount = 0;
  }
  public boolean researchedCoal() {
    return this.researchPoints >= GameConstants.PARAMETERS.RESEARCH_REQUIREMENTS.COAL;
  }
  public boolean researchedUranium() {
    return this.researchPoints >= GameConstants.PARAMETERS.RESEARCH_REQUIREMENTS.URANIUM;
  }
}