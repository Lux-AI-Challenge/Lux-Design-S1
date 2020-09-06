package main

import (
	"fmt"
	"./kit"
)

func main() {
		// create a new agent
		agent := kit.Agent {}
		// intialize agent
		agent.Initialize();

		for true {
				// wait for update from match engine
				agent.Update();
				// send some commands
				fmt.Printf("send some command, another command\n");
				// end turn
				agent.EndTurn();
				
		}
}