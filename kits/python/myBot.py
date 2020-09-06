from kit import Agent

# Create new agent
agent = Agent()

# initialize agent
agent.initialize()

# Once initialized, we enter an infinite loop
while True:

    # wait for update from match engine
    agent.update()

    commands = []

    # AI Code goes here #

    # push some commands in to be processed by the `MatchEngine` working under a `Design`
    commands.append('somecommand')
    commands.append('anothercommand')

    # submit commands to the `MatchEngine` and the `Match`, using ',' as the delimiter
    print(','.join(commands))

    # now we end our turn
    agent.end_turn()