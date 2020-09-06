
#include "kit.hpp"
#include <string>

int main() {
  kit::Agent agent = kit::Agent();
  // initialize
  agent.initialize();

  while(true) {
    // wait for updates
    agent.update();
    // send some commands
    std::cout << 'my command, other command' << std::endl << std::flush;
    // end turn
    agent.end_turn();
    
  }
  
  return 0;
}