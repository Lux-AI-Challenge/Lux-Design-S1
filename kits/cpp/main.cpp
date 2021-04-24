#include "lux/kit.hpp"
#include <string>
#include <vector>
using namespace std;
using namespace lux;
int main()
{
  kit::Agent agent = kit::Agent();
  // initialize
  agent.initialize();

  while (true)
  {
    // wait for updates
    agent.update();
    // send some commands
    vector<string> commands = vector<string>();
    // std::cout << "my command, other command" << std::endl << std::flush;
    Player player = agent.players[agent.id];
    Player opponent = agent.players[(agent.id + 1) % 2];
    if (agent.turn % 10 == 2 || (agent.turn % 10 == 1 && agent.turn != 1))
    {
      for (int i = 0; i < player.units.size(); i++)
      {
        Unit unit = player.units[i];
        commands.push_back(unit.move(DIRECTIONS::SOUTH));
      }
    }
    else if (agent.turn % 10 == 7 || agent.turn % 10 == 8)
    {
      for (int i = 0; i < player.units.size(); i++)
      {
        Unit unit = player.units[i];
        commands.push_back(unit.move(DIRECTIONS::NORTH));
      }
    }

    for (int i = 0; i < commands.size(); i++)
    {
      if (i != 0) cout << ",";
      cout << commands[i];
    }
    cout << endl;
    // end turn
    agent.end_turn();
  }

  return 0;
}