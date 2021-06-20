#include "lux/kit.hpp"
#include <string.h>
#include <vector>
#include <set>
#include <stdio.h>

using namespace std;
using namespace lux;
int main()
{
  kit::Agent gameState = kit::Agent();
  // initialize
  gameState.initialize();

  while (true)
  {
    /** Do not edit! **/
    // wait for updates
    gameState.update();

    vector<string> commands = vector<string>();
    
    /** AI Code Goes Below! **/

    Player player = gameState.players[gameState.id];
    Player opponent = gameState.players[(gameState.id + 1) % 2];

    GameMap gameMap = gameState.map;

    vector<Cell *> resourceTiles = vector<Cell *>();
    for (int y = 0; y < gameMap.height; y++)
    {
      for (int x = 0; x < gameMap.width; x++)
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
      // if our city has enough fuel to survive the whole night and 1000 extra fuel, lets increment citiesToBuild and let our workers know we have room for more city tiles
      if (city->fuel > city->getLightUpkeep() * (int) GAME_CONSTANTS["PARAMETERS"]["NIGHT_LENGTH"] + 1000)
      {
        citiesToBuild += 1;
      }
      for (auto citytile : city->citytiles)
      {
        if (citytile->canAct()) {
          // you can use the following to get the citytile to research or build a worker
          // commands.push_back(citytile.research());
          // commands.push_back(citytile.buildWorker());
        }
      }
    }

    // we iterate over all our units and do something with them
    for (int i = 0; i < player.units.size(); i++)
    {
      Unit unit = player.units[i];
      if (unit.isWorker())
      {
        if (unit.getCargoSpaceLeft() > 0)
        {
          // if the unit is a worker and we have space in cargo, lets find the nearest resource tile and try to mine it
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
          // if unit is a worker and there is no cargo space left, and we have cities, lets return to them
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
                // here we consider building city tiles provided we are adjacent to a city tile and we can build
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
    gameState.end_turn();
  }

  return 0;
}