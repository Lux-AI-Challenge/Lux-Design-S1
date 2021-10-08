using System.Collections.Generic;

namespace Bot.Lux
{
	public class City
	{
		public string CityId;
		public int Team;
		public double Fuel;
		public List<CityTile> CityTiles = new List<CityTile>();
		private readonly double _lightUpKeep;
		
		public City(int teamId, string cityId, double fuel, double lightUpKeep)
		{
			CityId = cityId;
			Team = teamId;
			Fuel = fuel;
			_lightUpKeep = lightUpKeep;
		}

		public CityTile AddCityTile(int x, int y, double cooldown)
		{
			var ct = new CityTile(Team, CityId, x, y, cooldown);
			CityTiles.Add(ct);
			return ct;
		}

		public double GetLightUpkeep()
		{
			return _lightUpKeep;
		}
    }
}
