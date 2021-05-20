from subprocess import Popen, PIPE, STDOUT
import sys
from os import path
import json
import atexit

agent_processes = [None, None]
dir_path = path.dirname(__file__)
def cleanup_process():
    global agent_processes
    for proc in agent_processes:
        if proc is not None:
            proc.kill()
def js_agent(observation, configuration):
    """
    a wrapper around a js agent
    """
    global agent_processes

    agent_process = agent_processes[observation.player]
    ### Do not edit ###
    if agent_process is None:
        agent_process = Popen(["node", path.abspath(path.join(dir_path, "main.js"))], stdin=PIPE, stdout=PIPE)
        agent_processes[observation.player] = agent_process
        atexit.register(cleanup_process)
    agent_process.stdin.write(("\n".join(observation["updates"]) + "\n").encode())
    agent_process.stdin.flush()
    
    agent1res = (agent_process.stdout.readline()).decode()
    _end_res = (agent_process.stdout.readline()).decode()
    outputs = agent1res.split("\n")[0].split(",")
    actions = []
    for cmd in outputs:
        if cmd != "":
            actions.append(cmd)
    return actions