#include "lux/kit.hpp"
#include <string.h>
#include <vector>
#include <set>
#include <stdio.h>

using namespace std;
using namespace lux;
int main()
{
  kit::Agent agent = kit::Agent();
  // initialize
  agent.initialize();

  while (true)
  {
    /** Do not edit! **/
    // wait for updates
    agent.update();

    vector<string> commands = vector<string>();
    
    /** AI Code Goes Below! **/

    Player player = agent.players[agent.id];
    Player opponent = agent.players[(agent.id + 1) % 2];

    GameMap gameMap = agent.map;

    vector<Cell *> resourceTiles = vector<Cell *>();
    for (int y = 0; y < agent.mapHeight; y++)
    {
      for (int x = 0; x < agent.mapWidth; x++)
      {
        Cell *cell = gameMap.getCell(x, y);
        if (cell->hasResource())
        {
          resourceTiles.push_back(cell);
        }
      }
    }

    int citiesToBuild = 0;
    for (auto it : player.cities)
    {
      City *city = it.second;
      if (city->getLightUpkeep() < city->fuel + 200)
      {
        citiesToBuild += 1;
      }
    }

    for (int i = 0; i < player.units.size(); i++)
    {
      Unit unit = player.units[i];
      if (unit.isWorker())
      {
        if (unit.getCargoSpaceLeft() > 0)
        {
          Cell *closestResourceTile;
          float closestDist = 9999999;
          for (auto it = resourceTiles.begin(); it != resourceTiles.end(); it++)
          {
            auto cell = *it;
            float dist = cell->pos.distanceTo(unit.pos);
            if (dist < closestDist)
            {
              closestDist = dist;
              closestResourceTile = cell;
            }
          }
          if (closestResourceTile != nullptr)
          {
            auto dir = unit.pos.directionTo(closestResourceTile->pos);
            commands.push_back(unit.move(dir));
          }
        }
        else
        {
          // if we have cities, return to them
          if (player.cities.size() > 0)
          {
            auto city_iter = player.cities.begin();
            auto city = city_iter->second;

            float closestDist = 999999;
            CityTile *closestCityTile;
            for (auto citytile : city->citytiles)
            {
              float dist = citytile->pos.distanceTo(unit.pos);
              if (dist < closestDist)
              {
                closestCityTile = citytile;
                closestDist = dist;
              }
            }
            if (closestCityTile != nullptr)
            {
              auto dir = unit.pos.directionTo(closestCityTile->pos);

              if (citiesToBuild > 0 && unit.pos.isAdjacent(closestCityTile->pos) && unit.canBuild(gameMap))
              {
                commands.push_back(unit.buildCity());
              }
              else
              {
                commands.push_back(unit.move(dir));
              }
            }
          }
        }
      }
    }

    /** AI Code Goes Above! **/

    /** Do not edit! **/
    for (int i = 0; i < commands.size(); i++)
    {
      if (i != 0)
        cout << ",";
      cout << commands[i];
    }
    cout << endl;
    // end turn
    agent.end_turn();
  }

  return 0;
}