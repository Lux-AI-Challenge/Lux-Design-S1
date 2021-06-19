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
    // TODO
    return this.researchPoints > 0;
  }
  public boolean researchedUranium() {
    return this.researchPoints > 0;
  }
  // def researched_coal(self):
// return self.researchPoints >= GAME_CONSTANTS["PARAMETERS"]["RESEARCH_REQUIREMENTS"]["COAL"]
// def researched_uanium(self):
// return self.researchPoints >= GAME_CONSTANTS["PARAMETERS"]["RESEARCH_REQUIREMENTS"]["URANIUM"]
}