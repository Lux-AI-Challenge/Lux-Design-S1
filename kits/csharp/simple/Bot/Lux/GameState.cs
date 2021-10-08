namespace Bot.Lux
{
	public class GameState
	{
		public GameMap Map;
		public int Turn = 0;
		public int Id = 0;
		public Player[] Players = { new Player(0), new Player(1) };

		public GameState()
		{

		}
	}
}
