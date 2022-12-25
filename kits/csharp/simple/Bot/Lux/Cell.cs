namespace Bot.Lux
{
	public class Cell
	{
		public Position Pos;
		public Resource Resource = null;
		public double Road = 0;
		public CityTile CityTile = null;

		public Cell(int x, int y)
		{
			Pos = new Position(x, y);
		}
		public bool HasResource()
		{
			return Resource != null && Resource.Amount > 0;
		}
	}
}
