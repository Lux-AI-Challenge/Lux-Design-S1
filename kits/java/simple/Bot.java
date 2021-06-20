import java.util.ArrayList;

import lux.*;

public class Bot {
  public static void main(final String[] args) throws Exception {
    Agent agent = new Agent();
    // initialize
    agent.initialize();
    while (true) {
      /** Do not edit! **/
      // wait for updates
      agent.update();

      ArrayList<String> commands = new ArrayList<>();
      GameState gameState = agent.gameState;
      /** AI Code Goes Below! **/

      Player player = gameState.players[gameState.id];
      Player opponent = gameState.players[(gameState.id + 1) % 2];
      GameMap gameMap = gameState.map;

      ArrayList<Cell> resourceTiles = new ArrayList<>();
      for (int y = 0; y < gameMap.height; y++) {
        for (int x = 0; x < gameMap.width; x++) {
          Cell cell = gameMap.getCell(x, y);
          if (cell.hasResource()) {
            resourceTiles.add(cell);
          }
        }
      }

      int citiesToBuild = 0;
      for (City city : player.cities.values()) {
        if (city.getLightUpkeep() < city.fuel + 200) {
          citiesToBuild += 1;
        }
      }

      for (int i = 0; i < player.units.size(); i++) {
        Unit unit = player.units.get(i);
        if (unit.isWorker()) {
          if (unit.getCargoSpaceLeft() > 0) {
            Cell closestResourceTile = null;
            double closestDist = 9999999;
            for (Cell cell : resourceTiles) {
              double dist = cell.pos.distanceTo(unit.pos);
              if (dist < closestDist) {
                closestDist = dist;
                closestResourceTile = cell;
              }
            }
            if (closestResourceTile != null) {
              Direction dir = unit.pos.directionTo(closestResourceTile.pos);
              commands.add(unit.move(dir));
            }
          } else {
            // if we have cities, return to them
            if (player.cities.size() > 0) {
              City city = player.cities.values().iterator().next();
              double closestDist = 999999;
              CityTile closestCityTile = null;
              for (CityTile citytile : city.citytiles) {
                double dist = citytile.pos.distanceTo(unit.pos);
                if (dist < closestDist) {
                  closestCityTile = citytile;
                  closestDist = dist;
                }
              }
              if (closestCityTile != null) {
                Direction dir = unit.pos.directionTo(closestCityTile.pos);
                if (citiesToBuild > 0 && unit.pos.isAdjacent(closestCityTile.pos) && unit.canBuild(gameMap)) {
                  commands.add(unit.buildCity());
                } else {
                  commands.add(unit.move(dir));
                }
              }
            }
          }
        }
      }
      /** AI Code Goes Above! **/

      /** Do not edit! **/
      StringBuilder commandBuilder = new StringBuilder("");
      for (int i = 0; i < commands.size(); i++) {
        if (i != 0) {
          commandBuilder.append(",");
        }
        commandBuilder.append(commands.get(i));
      }
      System.out.println(commandBuilder.toString());
      // end turn
      agent.endTurn();

    }
  }
}
