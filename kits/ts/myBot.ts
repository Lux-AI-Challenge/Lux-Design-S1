import { Agent } from './kit';

// create a new agent
const agent = new Agent();

// first initialize the agent, and then proceed to go in a loop waiting for updates and running the AI
agent.initialize().then(async () => {
  while(true) {
    
    // wait for update from match engine
    await agent.update();

    /** AI Code goes here */

    let commands: Array<string> = [];

    // push some commands in to be processed by the `MatchEngine` working under a `Design`
    commands.push('somecommand');
    commands.push('anothercommand');

    // submit commands to the `MatchEngine` and the `Match`, using ',' as the delimiter
    console.log(commands.join(','));
    
    // now we end our turn
    agent.endTurn();
    
  }
});