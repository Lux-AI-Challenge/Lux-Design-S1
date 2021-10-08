using System.Collections.Generic;

namespace Bot.Lux
{
	public class Player
	{
		public int Team;
		public int ResearchPoints;
		public List<Unit> Units = new List<Unit>();
		public Dictionary<string, City> Cities = new Dictionary<string, City>();
		public int CityTileCount;

		public Player(int team)
		{
			Team = team;
			ResearchPoints = 0;
			CityTileCount = 0;
		}

		public bool ResearchedCoal()
		{
			return ResearchPoints >= GameConstants.PARAMETERS.RESEARCH_REQUIREMENTS.COAL;
		}

		public bool ResearchedUranium()
		{
			return ResearchPoints >= GameConstants.PARAMETERS.RESEARCH_REQUIREMENTS.URANIUM;
		}
	}
}
