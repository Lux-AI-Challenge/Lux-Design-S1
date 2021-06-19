package lux;
public class GameState {
  public GameMap map;
  public int turn = 0;
  public int id = 0;
  public Player[] players = new Player[]{new Player(0), new Player(1)};
  public GameState() {

  }
}