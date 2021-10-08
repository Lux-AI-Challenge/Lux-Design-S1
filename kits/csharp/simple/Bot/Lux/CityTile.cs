namespace Bot.Lux
{
	public class CityTile
	{
		public string CityId;
		public int Team;
		public Position Pos;
		public double Cooldown;
		public CityTile(int teamId, string cityId, int x, int y, double cooldown)
		{
			CityId = cityId;
			Team = teamId;
			Pos = new Position(x, y);
			Cooldown = cooldown;
		}

		public bool CanAct()
		{
			return Cooldown < 1;
		}

		public string Research()
		{
			return $"r {Pos.X:d} {Pos.Y:d}";
		}

		public string BuildWorker()
		{
			return $"bw {Pos.X:d} {Pos.Y:d}";
		}

		public string BuildCart()
		{
			return $"bc {Pos.X:d} {Pos.Y:d}";
		}
	}
}
