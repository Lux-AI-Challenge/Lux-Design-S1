package lux;

import java.util.Scanner;

public class Agent {
    private final Scanner scanner;

    public GameState gameState = new GameState();

    /**
     * Constructor for a new agent User should edit this according to their `Design`
     */
    public Agent() {
      scanner = new Scanner(System.in);
    }

    /**
     * Initialize Agent for the `Match` User should edit this according to their
     * `Design`
     */
    public void initialize() {
      // get agent ID
      gameState.id = Integer.parseInt(scanner.nextLine());
      String mapInfo = scanner.nextLine();
      String[] mapInfoSplit = mapInfo.split(" ");
      int mapWidth = Integer.parseInt(mapInfoSplit[0]);
      int mapHeight = Integer.parseInt(mapInfoSplit[1]);
      gameState.map = new GameMap(mapWidth, mapHeight);
    }

    /**
     * Updates agent's own known state of `Match` User should edit this according to
     * their `Design`.
     */
    public void update() {
      // wait for the engine to send any updates
      gameState.map = new GameMap(gameState.map.width, gameState.map.height);
      gameState.turn += 1;
      gameState.players[0].cities.clear();
      gameState.players[0].units.clear();
      gameState.players[1].cities.clear();
      gameState.players[1].units.clear();
      while (true) {
        final String updateInfo = scanner.nextLine();
        if (updateInfo.equals(IOConstants.DONE.str)) {
          break;
        }
        String[] updates = updateInfo.split(" ");
        String inputIdentifier = updates[0];
        if (inputIdentifier.equals(IOConstants.RESEARCH_POINTS.str)) {
          int team = Integer.parseInt(updates[1]);
          this.gameState.players[team].researchPoints = Integer.parseInt(updates[2]);
        } else if (inputIdentifier.equals(IOConstants.RESOURCES.str)) {
          String type = updates[1];
          int x = Integer.parseInt(updates[2]);
          int y = Integer.parseInt(updates[3]);
          int amt = (int)(Double.parseDouble(updates[4]));
          this.gameState.map._setResource(type, x, y, amt);
        } else if (inputIdentifier.equals(IOConstants.UNITS.str)) {
          int i = 1;
          int unittype = Integer.parseInt(updates[i++]);
          int team = Integer.parseInt(updates[i++]);
          String unitid = updates[i++];
          int x = Integer.parseInt(updates[i++]);
          int y = Integer.parseInt(updates[i++]);
          double cooldown = Double.parseDouble(updates[i++]);
          int wood = Integer.parseInt(updates[i++]);
          int coal = Integer.parseInt(updates[i++]);
          int uranium = Integer.parseInt(updates[i++]);
          Unit unit = new Unit(team, unittype, unitid, x, y, cooldown, wood, coal, uranium);
          this.gameState.players[team].units.add(unit);
        } else if (inputIdentifier.equals(IOConstants.CITY.str)) {
          int i = 1;
          int team = Integer.parseInt(updates[i++]);
          String cityid = updates[i++];
          double fuel = Double.parseDouble(updates[i++]);
          double lightUpkeep = Double.parseDouble(updates[i++]);
          this.gameState.players[team].cities.put(cityid, new City(team, cityid, fuel, lightUpkeep));
        } else if (inputIdentifier.equals(IOConstants.CITY_TILES.str)) {
          int i = 1;
          int team = Integer.parseInt(updates[i++]);
          String cityid = updates[i++];
          int x = Integer.parseInt(updates[i++]);
          int y = Integer.parseInt(updates[i++]);
          double cooldown = Double.parseDouble(updates[i++]);
          City city = this.gameState.players[team].cities.get(cityid);
          CityTile citytile = city._add_city_tile(x, y, cooldown);
          this.gameState.map.getCell(x, y).citytile = citytile;
          this.gameState.players[team].cityTileCount += 1;
      } else if (inputIdentifier.equals(IOConstants.ROADS.str)) {
          int i = 1;
          int x = Integer.parseInt(updates[i++]);
          int y = Integer.parseInt(updates[i++]);
          double road = Double.parseDouble(updates[i++]);
          Cell cell = this.gameState.map.getCell(x, y);
          cell.road = road;
        }

      }
    }
    /**
     * End a turn
     */
    public void endTurn() {
        System.out.println("D_FINISH");
        System.out.flush();
    }
}
