import sys
from agent import agent

import julia
julia.install()

from julia.api import Julia
jl = Julia(compiled_modules=False)

from julia import Base
from julia import Main

from julia import Pkg
Pkg.add(url = "./lux") # Repo with agent implementation

Main.eval("using LuxAI")
from julia import LuxAI

if __name__ == "__main__":
    
    def read_input():
        """
        Reads input from stdin
        """
        try:
            return input()
        except EOFError as eof:
            raise SystemExit(eof)
    step = 0
    class Observation(Dict[str, any]):
        def __init__(self, player=0) -> None:
            self.player = player
            # self.updates = []
            # self.step = 0
    observation = Observation()
    observation["updates"] = []
    observation["step"] = 0
    player_id = 0
    while True:
        inputs = read_input()
        observation["updates"].append(inputs)
        
        if step == 0:
            player_id = int(observation["updates"][0])
            observation.player = player_id
            agent = LuxAI.agent(observation)
        if inputs == "D_DONE":
            actions = agent.update(observation)
            observation["updates"] = []
            step += 1
            observation["step"] = step
            print(",".join(actions))
            print("D_FINISH")
