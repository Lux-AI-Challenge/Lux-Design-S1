using System;
using System.IO;

namespace Bot.Lux
{
	public class Agent
	{
		public GameState GameState = new GameState();
		public TextReader Reader;

		/**
         * Constructor for a new agent User should edit this according to their `Design`
         */
		public Agent()
		{
			Reader = Console.In;
		}

		/**
         * Initialize Agent for the `Match` User should edit this according to their
         * `Design`
         */
		public void Initialize()
		{
			// get agent ID
			GameState.Id = int.Parse(Reader.ReadLine() ?? throw new InvalidOperationException());
			var mapInfo = Console.ReadLine();
			if (mapInfo == null) return;
			var mapInfoSplit = mapInfo.Split(" ");
			var mapWidth = int.Parse(mapInfoSplit[0]);
			var mapHeight = int.Parse(mapInfoSplit[1]);
			GameState.Map = new GameMap(mapWidth, mapHeight);
		}

		/**
         * Updates agent's own known state of `Match` User should edit this according to
         * their `Design`.
         */
		public void Update()
		{
			// wait for the engine to send any updates
			GameState.Map = new GameMap(GameState.Map.Width, GameState.Map.Height);
			GameState.Turn += 1;
			GameState.Players[0].Cities.Clear();
			GameState.Players[0].Units.Clear();
			GameState.Players[1].Cities.Clear();
			GameState.Players[1].Units.Clear();
			while (true)
			{
				var updateInfo = Reader.ReadLine();
				if (updateInfo == IOConstants.DONE)
				{
					break;
				}
				var updates = updateInfo.Split(" ");
				var inputIdentifier = updates[0];
				if (inputIdentifier == IOConstants.RESEARCH_POINTS)
				{
					var team = int.Parse(updates[1]);
					GameState.Players[team].ResearchPoints = int.Parse(updates[2]);
				}
				else if (inputIdentifier == IOConstants.RESOURCES)
				{
					var type = updates[1];
					var x = int.Parse(updates[2]);
					var y = int.Parse(updates[3]);
					var amt = (int)double.Parse(updates[4]);
					GameState.Map.SetResource(type, x, y, amt);
				}
				else if (inputIdentifier == IOConstants.UNITS)
				{
					var i = 1;
					var unitType = int.Parse(updates[i++]);
					var team = int.Parse(updates[i++]);
					var unitId = updates[i++];
					var x = int.Parse(updates[i++]);
					var y = int.Parse(updates[i++]);
					var cooldown = double.Parse(updates[i++]);
					var wood = int.Parse(updates[i++]);
					var coal = int.Parse(updates[i++]);
					var uranium = int.Parse(updates[i++]);
					var unit = new Unit(team, unitType, unitId, x, y, cooldown, wood, coal, uranium);
					GameState.Players[team].Units.Add(unit);
				}
				else if (inputIdentifier == IOConstants.CITY)
				{
					var i = 1;
					var team = int.Parse(updates[i++]);
					var cityId = updates[i++];
					var fuel = double.Parse(updates[i++]);
					var lightUpkeep = double.Parse(updates[i++]);
					GameState.Players[team].Cities.Add(cityId, new City(team, cityId, fuel, lightUpkeep));
				}
				else if (inputIdentifier == IOConstants.CITY_TILES)
				{
					var i = 1;
					var team = int.Parse(updates[i++]);
					var cityId = updates[i++];
					var x = int.Parse(updates[i++]);
					var y = int.Parse(updates[i++]);
					var cooldown = double.Parse(updates[i++]);
					var city = GameState.Players[team].Cities[cityId];
					var cityTile = city.AddCityTile(x, y, cooldown);
					GameState.Map.GetCell(x, y).CityTile = cityTile;
					GameState.Players[team].CityTileCount += 1;
				}
				else if (inputIdentifier == IOConstants.ROADS)
				{
					var i = 1;
					var x = int.Parse(updates[i++]);
					var y = int.Parse(updates[i++]);
					var road = double.Parse(updates[i++]);
					var cell = GameState.Map.GetCell(x, y);
					cell.Road = road;
				}
			}
		}

		/**
         * End a turn
         */
		public void EndTurn()
		{
			Console.Out.Write("D_FINISH");
			Console.Out.Flush();
		}
	}
}
