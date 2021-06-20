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

      ArrayList<String> actions = new ArrayList<>();
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
        // if our city has enough fuel to survive the whole night and 1000 extra fuel, lets increment citiesToBuild and let our workers know we have room for more city tiles
        if (city.fuel > city.getLightUpkeep() * GameConstants.PARAMETERS.NIGHT_LENGTH + 1000) {
          citiesToBuild += 1;
        }
        for (CityTile citytile : city.citytiles) {
          if (citytile.canAct()) {
            // you can use the following to get the citytile to research or build a worker
            // actions.add(citytile.buildWorker());
            // actions.add(citytile.research());
          }
        }
      }

      // we iterate over all our units and do something with them
      for (int i = 0; i < player.units.size(); i++) {
        Unit unit = player.units.get(i);
        if (unit.isWorker()) {
          if (unit.getCargoSpaceLeft() > 0) {
            // if the unit is a worker and we have space in cargo, lets find the nearest resource tile and try to mine it
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
              // move the unit in the direction towards the closest resource tile's position.
              actions.add(unit.move(dir));
            }
          } else {
            // if unit is a worker and there is no cargo space left, and we have cities, lets return to them
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
                  // here we consider building city tiles provided we are adjacent to a city tile and we can build
                  actions.add(unit.buildCity());
                } else {
                  actions.add(unit.move(dir));
                }
              }
            }
          }
        }
      }
      /** AI Code Goes Above! **/

      /** Do not edit! **/
      StringBuilder commandBuilder = new StringBuilder("");
      for (int i = 0; i < actions.size(); i++) {
        if (i != 0) {
          commandBuilder.append(",");
        }
        commandBuilder.append(actions.get(i));
      }
      System.out.println(commandBuilder.toString());
      // end turn
      agent.endTurn();

    }
  }
}
