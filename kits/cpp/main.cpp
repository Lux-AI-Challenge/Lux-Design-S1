#include "lux/kit.hpp"
#include <string.h>
#include <vector>
#include <set>
#include <stdio.h>

using namespace std;
using namespace lux;
// using json = nlohmann::json;
int main()
{
  // std::ifstream ifs("lux/game_constants.json");
  // json jf = json::parse(ifs);
  kit::Agent agent = kit::Agent();
  // initialize
  agent.initialize();

  while (true)
  {
    // wait for updates
    agent.update();

    vector<string> commands = vector<string>();

    Player player = agent.players[agent.id];
    Player opponent = agent.players[(agent.id + 1) % 2];

    GameMap gameMap = agent.map;

    commands.push_back(lux::Annotate::line(0, 0, 14, 2));

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
    for (auto it : player.cities) {
      City* city = it.second;
      if (city->getLightUpkeep() < city->fuel + 200) {
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
          Cell *closestResourceTile = resourceTiles[0];
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
          auto dir = unit.pos.directionTo(closestResourceTile->pos);
          commands.push_back(unit.move(dir));
        }
        else
        {
          // if we have cities, return to them
          if (player.cities.size() > 0)
          {
            auto city_iter = player.cities.begin();
            auto city = city_iter->second;

            auto dir = unit.pos.directionTo(city->citytiles[0]->pos);

            if (citiesToBuild > 0 && unit.pos.isAdjacent(city->citytiles[0]->pos) && unit.canBuild(gameMap)) {
              commands.push_back(unit.buildCity());
            }
            else {
              commands.push_back(unit.move(dir));
            }
          }
        }
      }
    }

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