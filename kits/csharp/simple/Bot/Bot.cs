using System;
using System.Collections.Generic;
using System.Text;
using Bot.Lux;

namespace Bot
{
	public class Bot
	{
		static void Main(string[] args)
		{
			var agent = new Agent();
			// initialize
			agent.Initialize();
			while (true)
			{
				// Do not edit! 
				// wait for updates
				agent.Update();

				var actions = new List<string>();
				var gameState = agent.GameState;
				/** AI Code Goes Below! **/

				var player = gameState.Players[gameState.Id];
				var opponent = gameState.Players[(gameState.Id + 1) % 2];
				var gameMap = gameState.Map;

				var resourceTiles = new List<Cell>();
				for (var y = 0; y < gameMap.Height; y++)
				{
					for (var x = 0; x < gameMap.Width; x++)
					{
						var cell = gameMap.GetCell(x, y);
						if (cell.HasResource())
						{
							resourceTiles.Add(cell);
						}
					}
				}

				// we iterate over all our units and do something with them
				foreach (var unit in player.Units)
				{
					if (unit.IsWorker() && unit.CanAct())
					{
						if (unit.GetCargoSpaceLeft() > 0)
						{
							// if the unit is a worker and we have space in cargo, lets find the nearest resource tile and try to mine it
							Cell closestResourceTile = null;
							double closestDist = 9999999;
							foreach (Cell cell in resourceTiles)
							{
								if (cell.Resource.Type == GameConstants.RESOURCE_TYPES.COAL && !player.ResearchedCoal()) continue;
								if (cell.Resource.Type == GameConstants.RESOURCE_TYPES.URANIUM && !player.ResearchedUranium()) continue;
								double dist = cell.Pos.DistanceTo(unit.Pos);
								if (dist < closestDist)
								{
									closestDist = dist;
									closestResourceTile = cell;
								}
							}

							if (closestResourceTile != null)
							{
								var dir = unit.Pos.DirectionTo(closestResourceTile.Pos);
								// move the unit in the direction towards the closest resource tile's position.
								actions.Add(unit.Move(dir));
							}
						}
						else
						{
							// if unit is a worker and there is no cargo space left, and we have cities, lets return to them
							if (player.Cities.Count > 0)
							{
								double closestDist = 999999;
								CityTile closestCityTile = null;
								foreach (var city in player.Cities.Values)
								{
									foreach (CityTile cityTile in city.CityTiles)
									{
										var dist = cityTile.Pos.DistanceTo(unit.Pos);
										if (dist < closestDist)
										{
											closestCityTile = cityTile;
											closestDist = dist;
										}
									}
								}

								if (closestCityTile != null)
								{
									var dir = unit.Pos.DirectionTo(closestCityTile.Pos);
									actions.Add(unit.Move(dir));
								}
							}
						}
					}
				}

				// you can add debug annotations using the static methods of the Annotate class.
				// actions.Add(Annotate.circle(0, 0));

				/** AI Code Goes Above! **/

				/** Do not edit! **/
				StringBuilder commandBuilder = new StringBuilder("");
				for (int i = 0; i < actions.Count; i++)
				{
					if (i != 0)
					{
						commandBuilder.Append(",");
					}
					commandBuilder.Append(actions[i]);
				}
				Console.Out.WriteLine(commandBuilder.ToString());
				// end turn
				agent.EndTurn();

			}
		}
	}
}
