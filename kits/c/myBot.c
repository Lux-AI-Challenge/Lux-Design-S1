
#include "kit.h"
#include <stdio.h>

int main() {
  // initialize
  agent_initialize();

  while(1) {
    // wait for updates
    agent_update();
    // send some commands
    printf("some command, my other command\n");
    // end turn
    agent_end_turn();
    
  }
  
  return 0;
}